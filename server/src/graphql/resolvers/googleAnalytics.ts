import { UserInputError, ApolloError } from 'apollo-server-express';
import { flatten, get } from 'lodash';

import Account from '../../models/Account';
import Client from '../../models/Client';
import { GoogleAnalyticsReport, Platform, DateType, View } from '../../types';
import { getAnalyticsReport, AnalyticsRequestArgs, getProperties, getGoals, getGoalData } from '../../connections/googleAnalytics';
import { datePresets } from '../../utils/dates';

export default {
  Query: {
    getGoogleAnalyticsReport: async (_: any, { args }: {
      args: Omit<AnalyticsRequestArgs, 'email'> & {
        clientId: string
        dateType: DateType
      }
    }): Promise<GoogleAnalyticsReport> => {
      const client = await Client.findById(args.clientId);
      if (!client) throw new UserInputError(`Client with ID "${args.clientId}" does not exist`);

      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new ApolloError(`Google Analytics account "${client.gaAccount}" does not exist`);

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

      const data = await getAnalyticsReport({
        ...args,
        ...dates,
        viewId,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken
      });

      return {
        clientId: args.clientId,
        viewId: args.viewId,
        platform: Platform.GOOGLE_ANALYTICS,
        dateType: args.dateType,
        // @ts-ignore
        startDate: dates.startDate || args.startDate,
        // @ts-ignore
        endDate: dates.endDate || args.endDate,
        channel: args.channel,
        data
      };
    },

    getProperties: async (_:any, { email }: { email: string }) => {
      const account = await Account.findOne({ email });
      if (!account) throw new UserInputError(`Account with email "${email}" does not exist`);

      if (!account.refreshToken && !account.accessToken) {
        throw new ApolloError(`No auth tokens found on account "${email}"`);
      }

      const data = await getProperties({ accessToken: account.accessToken, refreshToken: account.refreshToken });
      return data;
    },

    getGoals: async (_:any, { clientId, viewId }: { 
      clientId: string
      viewId: string
    }) => {
      const client = await Client.findById(clientId);
      if (!client) throw new UserInputError(`Client with ID "${clientId}" does not exist`);

      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new ApolloError(`Google Analytics account "${client.gaAccount}" does not exist`);

      const view = client.views.find(v => v.id === viewId);
      if (!view) throw new UserInputError(`View with ID "${viewId}" does not exist`);

      const data = await getGoals({
        viewId,
        webPropertyId: view.webPropertyId,
        accountId: view.accountId,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken
      });
      return data;
    },

    getGoalsFromIds: async (_:void, { email, viewIds }: { email: string, viewIds: View[] }) => {
      const account = await Account.findOne({ email });
      if (!account) throw new ApolloError(`Google Analytics account "${email}" does not exist`);

      const requests = viewIds.map(view => {
        return getGoals({
          viewId: view.id,
          webPropertyId: view.webPropertyId,
          accountId: view.accountId,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken
        });
      });

      const data = await Promise.all(requests);
      return flatten(data);
    },

    getClientGoalCompletions: async (_:void, { args }: { 
      args: Omit<AnalyticsRequestArgs, 'viewId' | 'webPropertyId' | 'accountId'> & { 
        clientId: string
        dateType: DateType
      } 
    }) => {
      const client = await Client.findById(args.clientId);
      if (!client) throw new UserInputError(`Client with ID "${args.clientId}" does not exist`);

      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new ApolloError(`Google Analytics account "${client.gaAccount}" does not exist`);

      let dates = {};
      if (args.dateType !== DateType.CUSTOM) {
        dates = datePresets[args.dateType]();
      }

      // Get unique view IDs from goals.
      const viewIds = client.goals.reduce((result, goal) => {
        if (!result.includes(goal.viewId)) result.push(goal.viewId);
        return result;
      }, []);

      const completionRequests = viewIds.map(viewId => {
        // Can only request 10 metrics per request.
        // TODO: Batch and return all goal completions.
        const goalIds = client.goals.filter(goal => goal.viewId === viewId).slice(0, 10).map(goal => goal.id);

        return getGoalData({
          metric: 'Completions',
          viewId,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          goalIds,
          channel: args.channel,
          startDate: args.startDate,
          endDate: args.endDate,
          ...dates
        });
      });

      const conversionRateRequests = viewIds.map(viewId => {
        // Can only request 10 metrics per request.
        // TODO: Batch and return all goal completions.
        const goalIds = client.goals.filter(goal => goal.viewId === viewId).slice(0, 10).map(goal => goal.id);

        return getGoalData({
          metric: 'ConversionRate',
          viewId,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          goalIds,
          channel: args.channel,
          startDate: args.startDate,
          endDate: args.endDate,
          ...dates
        });
      });

      const data = await Promise.all(completionRequests.concat(conversionRateRequests));

      return flatten(data).map(entry => {
        const goal = client.goals.find(g => g.id === entry.goalId && g.viewId === entry.viewId);

        return {
          ...entry,
          viewName: client.views.find(v => v.id === entry.viewId).name,
          goalName: goal.name,
          url: goal.url
        };
      });
    }
  }
};