import { google, analyticsreporting_v4 } from 'googleapis';
import { get } from 'lodash';

import { oauthConfig } from '../config';
import { Platform, GoogleAdsReport } from '../types';
import { metrics } from '../utils/constants';
import { roundWithPrecision } from '../utils/helpers';

export interface AdwordsRequestArgs {
  accessToken?: string
  refreshToken?: string
  viewId: string
  startDate: Date | string
  endDate: Date | string
  dimensions?: string[]
};

/**
* Gets a Google Ads report for a given view ID.
* 
* @param {string} [accessToken] - Google access token for this account.
* @param {string} [refreshToken] - Google refresh token for this account.
* @param {string} viewId - The view ID to get a report for.
* @param {(Date|number)} startDate - Start date 
* @param {(Date|number)} endDate - End date
* @return A report on preset Google Ads metrics for the given ID.
*/
export const getAdwordsReport = async ({
  accessToken,
  refreshToken,
  viewId,
  startDate,
  endDate,
  dimensions = []
}: AdwordsRequestArgs) => {
  // Set tokens for this account
  const authClient = new google.auth.OAuth2(oauthConfig.clientID, oauthConfig.clientSecret);
  authClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  const reportRequests = [{
    viewId,
    dateRanges: { startDate, endDate },
    metrics: metrics[Platform.GOOGLE_ADS].map(expression => ({ expression })),
    dimensions: dimensions.map(name => ({ name }))
  }];

  const { data } = await google.analyticsreporting('v4').reports.batchGet({
    // @ts-ignore
    auth: authClient,
    requestBody: { reportRequests }
  });

  const dimensionNames = data.reports[0].columnHeader.dimensions || [];

  const rows = get(data, 'reports[0].data.rows', []);

  const reports: GoogleAdsReport['data'] = rows.map((row: analyticsreporting_v4.Schema$ReportRow) => ({
    dimensions: dimensionNames.map((name: string, i: number) => ({ name, value: row.dimensions[i] })),
    clicks: row.metrics[0].values[0],
    impressions: row.metrics[0].values[1],
    ctr: roundWithPrecision(row.metrics[0].values[2]),
    cpc: roundWithPrecision(row.metrics[0].values[3]),
    cost: roundWithPrecision(row.metrics[0].values[4]),
    totalConversionValue: roundWithPrecision(row.metrics[0].values[5]),
    costPerConversion: roundWithPrecision(row.metrics[0].values[6]),
    roas: roundWithPrecision(row.metrics[0].values[7])
  }));

  return reports;
};