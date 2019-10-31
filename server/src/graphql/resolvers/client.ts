import { ApolloError, UserInputError } from 'apollo-server-core';

import Client, { ClientDocument } from '../../models/Client';
import Account from '../../models/Account';
import { AnalyticsRequestArgs, getAnalyticsReport } from '../../connections/googleAnalytics';
import { DateType, View, Services } from '../../types';
import { datePresets } from '../../utils/dates';
import { AdwordsRequestArgs, getAdwordsReport } from '../../connections/googleAds';
import { FacebookRequestArgs, getFacebookAdsReport } from '../../connections/facebookAds';

interface GAMetrics {
  sessions: number
  transactions: number
  goalCompletions: number
  goalConversionRate: number
}

interface AdwordsMetrics {
  clicks: number
  impressions: number
  ctr: number
  cpc: number
  cost: number
  totalConversionValue: number
  costPerConversion: number
}

interface ClientInput {
  id: string
  name: string
  channels: string[]
  leads: string[]
  team: string[]
  gaAccount: string
}

interface Filters {
  services: Services[]
  platform: string
  industry: string
  tier: number
}

export default {
  Query: {
    getClients: async (_:any, { filters }: { filters: Filters }) => {
      const requirements: any = {};

      // TODO: Tidy this
      if (filters && filters.services.length > 0) {
        requirements.services = filters.services[0];
      }
      if (filters && filters.platform === 'Facebook Ads') {
        requirements.facebookAdsId = { $nin: [null, undefined, ''] };
      }
      if (filters && filters.industry && filters.industry !== 'None') {
        requirements.industry = filters.industry;
      }
      if (filters && filters.tier && filters.tier !== 0) {
        requirements.tier = filters.tier;
      }

      return await Client.find(requirements)
        .populate('leads')
        .populate('team')
        .sort({ name: 1 });
    },

    getClientById: async (_: any, { id }: { id: string }) => {
      return await Client.findById(id)
        .populate('leads')
        .populate('team');
    },

    getAccounts: async () => {
      const accounts = await Account.find({}).sort({ email: 1 });
      return accounts.map(account => account.email);
    },
  },

  Client: {
    googleAnalytics: async (client: ClientDocument, { args }: {
      args: Omit<AnalyticsRequestArgs, 'email'> & { dateType: DateType }
    }): Promise<GAMetrics> => {
      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new ApolloError(`Google Analytics account "${client.gaAccount}" does not exist`);

      let dates = {};
      if (args.dateType !== DateType.CUSTOM) {
        dates = datePresets[args.dateType]();
      }

      let viewId;
      if (!client.mainViewId) {
        const defaultView = client.views[0];
        if (!defaultView) throw new Error('No default view found');
        viewId = defaultView.id;
      } else {
        viewId = client.mainViewId;
      }
     
      const data = await getAnalyticsReport({
        ...args,
        ...dates,
        viewId,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken
      });
      return { ...data[0] };
    },

    googleAds: async (client: ClientDocument, { args }: {
      args: Omit<AdwordsRequestArgs, 'email'> & { dateType: DateType }
    }): Promise<AdwordsMetrics> => {
      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new UserInputError(`Google Analytics account "${client.gaAccount}" does not exist`);

      let dates = {};
      if (args.dateType !== DateType.CUSTOM) {
        dates = datePresets[args.dateType]();
      }

      let viewId;
      if (!args.viewId) {
        const defaultView = client.views[0];
        if (!defaultView) throw new Error('No default view found');
        viewId = defaultView.id;
      }

      const data = await getAdwordsReport({
        ...args,
        ...dates,
        viewId,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken
      });
      return { ...data[0] };
    },

    facebookAds: async (client: ClientDocument, { args }: {
      args: Omit<FacebookRequestArgs, 'accountId'>
    }) => {
      const data = await getFacebookAdsReport({
        accountId: client.facebookAdsId,
        ...args
      });
      return data[0];
    }
  },

  Mutation: {
    createClient: async (_:any, { args }: { args: ClientInput }) => {
      const account = await Account.findOne({ email: args.gaAccount });
      if (!account) throw new UserInputError(`Google Analytics account "${args.gaAccount}" does not exist`);

      const client = await Client.create(args);
      return client;
    },

    addView: async (_:any, { clientId, args }: { clientId: string, args: View }) => {
      const client = await Client.findById(clientId);
      if (!client) throw new UserInputError(`Client "${clientId}" does not exist`);

      client.views.push(args);
      await client.save();
      return client;
    },

    editClient: async (_:any, { args }: { args: ClientInput }) => {
      const client = await Client.findByIdAndUpdate(args.id, args, { new: true });
      return client;
    }
  }
};