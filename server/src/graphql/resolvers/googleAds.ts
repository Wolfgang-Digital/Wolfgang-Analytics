import { UserInputError } from 'apollo-server-express';

import Account from '../../models/Account';
import Client from '../../models/Client';
import { GoogleAdsReport, Platform, DateType } from '../../types';
import { getAdwordsReport, AdwordsRequestArgs } from '../../connections/googleAds';
import { datePresets } from '../../utils/dates';

export default {
  Query: {
    getGoogleAdsReport: async (_: any, { args }: {
      args: Omit<AdwordsRequestArgs, 'email'> & {
        clientId: string
        dateType: DateType
      }
    }): Promise<GoogleAdsReport> => {
      const client = await Client.findById(args.clientId);

      if (!client) throw new UserInputError(`Client with ID "${args.clientId}" does not exist`);

      const account = await Account.findOne({ email: client.gaAccount });

      if (!account) throw new UserInputError(`Google Analytics account "${client.gaAccount}" does not exist`);

      let dates = {};
      if (args.dateType !== DateType.CUSTOM) {
        dates = datePresets[args.dateType]();
      }

      const data = await getAdwordsReport({
        ...args,
        ...dates,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken
      });

      return {
        clientId: args.clientId,
        viewId: args.viewId,
        platform: Platform.GOOGLE_ADS,
        dateType: args.dateType,
        // @ts-ignore
        startDate: dates.startDate || args.startDate,
        // @ts-ignore
        endDate: dates.endDate || args.endDate,
        data
      };
    }
  }
};