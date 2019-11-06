import { google, analytics_v3, analyticsreporting_v4 } from 'googleapis';
import { get, startCase, sumBy, meanBy } from 'lodash';
import { OAuth2Client } from 'googleapis-common';

import { oauthConfig } from '../config';
import { WebProperty, View, Goal, Channel, GoogleAnalyticsReport, Platform } from '../types';
import { metrics, filters } from '../utils/constants';
import { roundWithPrecision } from '../utils/helpers';

export interface AnalyticsRequestArgs {
  accessToken?: string
  refreshToken?: string
  viewId: string
  accountId: string
  webPropertyId: string
  startDate: Date | string
  endDate: Date | string
  channel: Channel
  dimensions?: string[]
};

export interface GoalData {
  metric: 'Conversions' | 'Conversion Rate'
  viewId: string
  goalId: string
  value: number
}

const authClient = new google.auth.OAuth2(oauthConfig.clientID, oauthConfig.clientSecret);

/**
* Gets all web properties views associated with a Google Analytics account.
* 
* @param {string} [accessToken] - Google access token for this account.
* @param {string} [refreshToken] - Google refresh token for this account.
*
* @return A list of web properties and their views associated with this account.
*/
export const getProperties = async ({
  accessToken,
  refreshToken
}: Pick<AnalyticsRequestArgs, 'accessToken' | 'refreshToken'>): Promise<WebProperty[]> => {
  // Set tokens for this account
  authClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  // Get all properties associated with this account
  const { data: properties } = await google.analytics('v3').management.webproperties.list({
    auth: authClient,
    accountId: '~all'
  });

  // Get all views associated with this account
  const { data: views } = await google.analytics('v3').management.profiles.list({
    auth: authClient,
    accountId: '~all',
    webPropertyId: '~all'
  });

  if (!properties.items) return [];

  // Map views to properties and sort by name
  const combinedResults: WebProperty[] = properties.items
    .filter(property => property.name && property.id && property.accountId)
    .map(property => {
      // Get all views for this property
      const propertyViews: View[] = get(views, 'items', [])
        .filter(view => view.accountId === property.accountId)
        .reduce((result: View[], view) => {
          // Skip views with incomplete data
          if (!view.id || !view.name || !view.accountId || !view.webPropertyId || !view.websiteUrl) {
            return result;
          }

          result.push({
            id: view.id,
            name: view.name,
            accountId: view.accountId,
            webPropertyId: view.webPropertyId,
            websiteUrl: view.websiteUrl
          });

          return result;
        }, [])
        .sort((a: View, b: View) => a.name.localeCompare(b.name));

      return {
        id: property.id,
        name: property.name,
        accountId: property.accountId,
        views: propertyViews
      };
    })
    // @ts-ignore
    .sort((a: WebProperty, b: WebProperty) => a.name.localeCompare(b.name));

  return combinedResults;
};

/**
* Gets all web properties views associated with a Google Analytics account.
* 
* @param {string} [accessToken] - Google access token for this account.
* @param {string} [refreshToken] - Google refresh token for this account.
* @param {string} viewId - The view ID to get goals for.
*
* @return A list of all goals and values associated with this view.
*/
export const getGoals = async ({
  accessToken,
  refreshToken,
  viewId,
  webPropertyId,
  accountId
}: Pick<AnalyticsRequestArgs, 'accessToken' | 'viewId' | 'refreshToken' | 'webPropertyId' | 'accountId'>): Promise<Goal[]> => {
  // Set tokens for this account
  authClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  const res = await google.analytics('v3').management.goals.list({
    auth: authClient,
    profileId: viewId,
    webPropertyId,
    accountId
  });

  const data: analytics_v3.Schema$Goal[] = get(res, 'data.items', []);

  const goals = data.reduce((result: Goal[], goal) => {
    // Skip goals with incomplete data
    if (!goal.id || !goal.profileId || !goal.name || !goal.type) {
      return result;
    }

    result.push({
      id: goal.id,
      viewId: goal.profileId,
      name: goal.name,
      goalType: goal.type as Goal['goalType'],
      value: goal.value,
      isActive: goal.active,
      url: get(goal, 'urlDestinationDetails.url', '')
    });

    return result;
  }, []);

  return goals;
};

/**
* Gets a Google Analytics report for a given view ID.
* 
* @param {string} [accessToken] - Google access token for this account.
* @param {string} [refreshToken] - Google refresh token for this account.
* @param {string} viewId - The view ID to get a report for.
* @param {(Date|number)} startDate - Start date 
* @param {(Date|number)} endDate - End date
* @param {string} channel - Determines the filters applied.
* @param {string[]} [dimensions] - List of GA dimensions.
*
* @return A report on preset Google Analytics metrics for the given ID.
*/
export const getAnalyticsReport = async ({
  accessToken,
  refreshToken,
  viewId,
  startDate,
  endDate,
  channel,
  dimensions = []
}: Omit<AnalyticsRequestArgs, 'accountId' | 'webPropertyId'>) => {
  // Set tokens for this account
  const authClient = new google.auth.OAuth2(oauthConfig.clientID, oauthConfig.clientSecret);
  authClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  
  const reportRequests = [{
    viewId,
    dateRanges: { startDate, endDate },
    metrics: metrics[Platform.GOOGLE_ANALYTICS].map(expression => ({ expression })),
    filtersExpression: filters[channel].join(','),
    dimensions: dimensions.map(name => ({ name }))
  }];

  const { data } = await google.analyticsreporting('v4').reports.batchGet({
    // @ts-ignore
    auth: authClient,
    requestBody: { reportRequests }
  });

  const dimensionNames = get(data, 'reports[0].columnHeader.dimensions', []);
  const rows = get(data, 'reports[0].data.rows', []);

  const reports: GoogleAnalyticsReport['data'] = rows.map((row: analyticsreporting_v4.Schema$ReportRow) => ({
    dimensions: dimensionNames.map((name: string, i: number) => ({ name, value: row.dimensions[i] })),
    sessions: row.metrics[0].values[0],
    transactions: row.metrics[0].values[1],
    conversionRate: roundWithPrecision(row.metrics[0].values[2]),
    goalCompletions: row.metrics[0].values[3],
    goalConversionRate: roundWithPrecision(row.metrics[0].values[4])
  }));

  return reports;
};

export const getGoalData = async({
  metric,
  accessToken,
  refreshToken,
  viewId,
  goalIds,
  startDate,
  endDate,
  channel
}: Omit<AnalyticsRequestArgs, 'accountId' | 'webPropertyId'> & {
  metric: 'Completions' | 'ConversionRate'
  goalIds: string[]
}) => {
  const authClient = new google.auth.OAuth2(oauthConfig.clientID, oauthConfig.clientSecret);
  authClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  const reportRequests = [{
    viewId,
    dateRanges: { startDate, endDate },
    metrics: goalIds.map(id => ({ expression: `ga:goal${id}${metric}` })),
    filtersExpression: filters[channel].join(','),
    dimensions: [{ name: 'ga:date' }]
  }];

  const { data } = await google.analyticsreporting('v4').reports.batchGet({
    // @ts-ignore
    auth: authClient,
    requestBody: { reportRequests }
  });

  const headers = get(data, 'reports[0].columnHeader.metricHeader.metricHeaderEntries', []);
  const rows = get(data, 'reports[0].data.rows', []);

  const reports = headers.map((header: any, i: number) => {
    return {
      metric: startCase(metric),
      viewId,
      goalId: header.name.match(/[0-9]+/g)[0],

      total: metric === 'Completions'
        ? sumBy(rows, (o: any) => parseFloat(o.metrics[0].values[i]))
        : meanBy(rows, (o: any) => parseFloat(o.metrics[0].values[i])),
      
      values: rows.map((row: any) => {
        const date = row.dimensions[0].match(/([0-9]...)([0-9].)([0-9].)/);

        return {
          date: `${date[1]}-${date[2]}-${date[3]}`,
          value: row.metrics[0].values[i]
        };
      })
    };
  });

  return reports;
};

interface SingleMetricArgs {
  authClient: OAuth2Client
  viewId: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: {
    expression: string
  }[]
  filtersExpression: string
  dimensions: {
    name: string
  }[]
}

export const getMetric = async ({
  authClient,
  viewId,
  dateRange,
  metrics,
  filtersExpression,
  dimensions
}: SingleMetricArgs) => {
  const reportRequests = [{
    viewId,
    dateRanges: dateRange,
    metrics,
    filtersExpression,
    dimensions
  }];

  const { data } = await google.analyticsreporting('v4').reports.batchGet({
    // @ts-ignore
    auth: authClient,
    requestBody: { reportRequests }
  });

  const rows = get(data, 'reports[0].data.rows', []);

  return rows.map((row: analyticsreporting_v4.Schema$ReportRow) => {
    const date = row.dimensions[0].match(/([0-9]...)([0-9].)([0-9].)/);

    return {
      date: `${date[1]}-${date[2]}-${date[3]}`,
      value: row.metrics[0].values[0]
    };
  });
};