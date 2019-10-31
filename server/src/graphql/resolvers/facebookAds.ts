import { UserInputError, ValidationError } from 'apollo-server-express';

import Client from '../../models/Client';
import { Platform } from '../../types';
import { getFacebookAdsReport, FacebookRequestArgs } from '../../connections/facebookAds';

export default {
  Query: {
    getFacebookAdsReport: async (_: any, { args }: {
      args: Omit<FacebookRequestArgs, 'accountId'> & {
        clientId: string
      }
    }) => {
      const client = await Client.findById(args.clientId);

      if (!client) throw new UserInputError(`Client with ID "${args.clientId}" does not exist`);

      if (!client.facebookAdsId) throw new ValidationError('Facebook ID not available');

      const data = await getFacebookAdsReport({
        ...args,
        accountId: client.facebookAdsId
      });
      
      return {
        clientId: args.clientId,
        platform: Platform.FACEBOOK_ADS,
        dateType: args.dateType,
        startDate: args.startDate,
        endDate: args.endDate,
        data
      }; 
    }
  }
};