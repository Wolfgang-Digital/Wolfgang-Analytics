import { UserInputError, ApolloError } from 'apollo-server-express';
import { flatten } from 'lodash';
import { google } from 'googleapis';

import Account from '../../models/Account';
import Client from '../../models/Client';
import { GoogleAnalyticsReport, Platform, DateType, View, Kpi } from '../../types';
import { getAnalyticsReport, AnalyticsRequestArgs, getProperties, getGoals, getGoalData } from '../../connections/googleAnalytics';
import { datePresets } from '../../utils/dates';
import { oauthConfig } from '../../config';
import { getMetric } from '../../connections/googleAnalytics';
import { filters } from '../../utils/constants';
import { getFbMetric } from '../../connections/facebookAds';

interface DateArgs {
  dateType: DateType
  startDate?: string
  endDate?: string
}

const getChannel = (str: string) => {
  switch (str) {
    case 'Organic':
      return 'ORGANIC';

    case 'Paid Search':
      return 'PAID_SEARCH';

    case 'Paid Social':
      return 'SOCIAL';

    default:
      return 'ALL';
  }
};

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

    getProperties: async (_: any, { email }: { email: string }) => {
      const account = await Account.findOne({ email });
      if (!account) throw new UserInputError(`Account with email "${email}" does not exist`);

      if (!account.refreshToken && !account.accessToken) {
        throw new ApolloError(`No auth tokens found on account "${email}"`);
      }

      const data = await getProperties({ accessToken: account.accessToken, refreshToken: account.refreshToken });
      return data;
    },

    getGoals: async (_: any, { clientId, viewId }: {
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

    getGoalsFromIds: async (_: void, { email, viewIds }: { email: string, viewIds: View[] }) => {
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

    getClientGoalCompletions: async (_: void, { args }: {
      args: Omit<AnalyticsRequestArgs, 'viewId' | 'webPropertyId' | 'accountId'> & {
        clientId: string
        dateType: DateType
      }
    }) => {
      const client = await Client.findById(args.clientId);
      if (!client) throw new UserInputError(`Client with ID "${args.clientId}" does not exist`);

      if (client.goals.length === 0) return [];

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

      const sortedData: any = [];
      for (let i = 0; i < data[0].length; i++) {
        sortedData.push(data[0][i]);
        sortedData.push(data[1][i]);
      }

      return sortedData.map((entry: any) => {
        const goal = client.goals.find(g => g.id === entry.goalId && g.viewId === entry.viewId);

        return {
          ...entry,
          viewName: client.views.find(v => v.id === entry.viewId).name,
          goalName: goal.name,
          url: goal.url
        };
      });
    },

    getClientKpis: async (_: void, { clientId, args }: { clientId: string, args: DateArgs }) => {
      const client = await Client.findById(clientId);
      if (!client) throw new UserInputError(`Client with ID "${clientId}" does not exist`);

      if (client.kpis.length === 0) return [];

      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new ApolloError(`Google Analytics account "${client.gaAccount}" does not exist`);

      const authClient = new google.auth.OAuth2(oauthConfig.clientID, oauthConfig.clientSecret);
      authClient.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken });

      let dates = { startDate: args.startDate, endDate: args.endDate };
      if (args.dateType !== DateType.CUSTOM) {
        dates = datePresets[args.dateType]();
      }

      const requests = client.kpis.map(kpi => {
        switch (kpi.platform) {
          case 'Google Analytics':
            return getMetric({
              authClient,
              viewId: client.mainViewId || client.views[0].id,
              dateRange: dates,
              metrics: [{ expression: `ga:${kpi.metric}` }],
              filtersExpression: filters[getChannel(kpi.channel)].join(','),
              dimensions: [{ name: 'ga:date' }]
            });

          case 'Google Ads':
            return getMetric({
              authClient,
              viewId: client.mainViewId || client.views[0].id,
              dateRange: dates,
              metrics: [{ expression: `ga:${kpi.metric}` }],
              filtersExpression: filters.PAID_SEARCH.join(','),
              dimensions: [{ name: 'ga:date' }]
            });

          case 'Facebook Ads':
            if (!client.facebookAdsId) throw new UserInputError('No Facebook Ads ID set');

            return getFbMetric({
              metric: kpi.metric,
              accountId: client.facebookAdsId,
              startDate: dates.startDate,
              endDate: dates.endDate
            });

          default:
            break;
        }
      });

      const data = await Promise.all(requests);

      return data.map((result, i) => {
        return {
          metric: client.kpis[i].metric,
          platform: client.kpis[i].platform,
          channel: client.kpis[i].channel,
          data: result
        };
      });
    },

    getClientMetric: async (_: void, { clientId, date, metric }: {
      clientId: string
      date: DateArgs
      metric: Kpi
    }) => {
      const client = await Client.findById(clientId);
      if (!client) throw new UserInputError(`Client with ID "${clientId}" does not exist`);

      const account = await Account.findOne({ email: client.gaAccount });
      if (!account) throw new ApolloError(`Google Analytics account "${client.gaAccount}" does not exist`);

      const authClient = new google.auth.OAuth2(oauthConfig.clientID, oauthConfig.clientSecret);
      authClient.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken });

      let dates = { startDate: date.startDate, endDate: date.endDate };
      if (date.dateType !== DateType.CUSTOM) {
        dates = datePresets[date.dateType]();
      }

      let result;

      switch (metric.platform) {
        case 'Google Analytics':
          result = await getMetric({
            authClient,
            viewId: client.mainViewId || client.views[0].id,
            dateRange: dates,
            metrics: [{ expression: `ga:${metric.metric.toLowerCase()}` }],
            filtersExpression: filters[getChannel(metric.channel)].join(','),
            dimensions: [{ name: 'ga:date' }]
          });
          break;

        case 'Google Ads':
          const metricName = metric.metric === 'Cost' ? 'adCost' : metric.metric.toLowerCase();
          result = await getMetric({
            authClient,
            viewId: client.mainViewId || client.views[0].id,
            dateRange: dates,
            metrics: [{ expression: `ga:${metricName}` }],
            filtersExpression: filters.PAID_SEARCH.join(','),
            dimensions: [{ name: 'ga:date' }]
          });
          break;

        case 'Facebook Ads':
          if (!client.facebookAdsId) throw new UserInputError('No Facebook Ads ID set');

          result = await getFbMetric({
            metric: metric.metric,
            accountId: client.facebookAdsId || '',
            startDate: dates.startDate,
            endDate: dates.endDate
          });
          break;

        default:
          break;
      }

      return {
        ...metric,
        data: result
      };
    }
  }
};