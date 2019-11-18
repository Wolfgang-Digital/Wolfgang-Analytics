import fetch from 'node-fetch';

import { Platform, Report, FacebookAdsReport } from '../types';
import { metrics } from '../utils/constants';
import { roundWithPrecision } from '../utils/helpers';

export interface FacebookRequestArgs {
  accountId: string
  dateType: Report['dateType']
  startDate?: Date | string
  endDate?: Date | string
}

type MetricData = {
  [name: string]: {
    action_value: string
    value: string
  }[]
} & {
  date_start: string
  date_end: string
}

interface FacebookResponseData {
  impressions: number
  reach: number
  cpc: number
  ctr: number
  outbound_clicks: {
    action_type: string
    value: number
  }[]
  cost_per_outbound_click: {
    action_type: string
    value: number
  }[]
  date_start: string
  date_stop: string
}

const BASE_URL = 'https://graph.facebook.com/v5.0/';

export const datePresets: { [key: string]: string } = {
  LAST_30_DAYS: 'last_30d',
  LAST_MONTH: 'last_month',
  YEAR_TO_DATE: 'this_year'
};

/**
* Gets a Facebook Ads report for a given account ID.
* 
* @param {string} dateType - The name of the date preset, if appilicable. (e.g. LAST_MONTH)
* @param {string} accountId - The account ID to get a report for.
* @param {(Date|number)} startDate - Start date 
* @param {(Date|number)} endDate - End date
*
* @return A report on preset Facebook Ads metrics for the given ID.
*/
export const getFacebookAdsReport = async ({
  accountId,
  dateType,
  startDate,
  endDate
}: FacebookRequestArgs) => {
  if (dateType === 'CUSTOM' && (!startDate || !endDate)) {
    throw new Error('Must specify either a date preset or start and end dates');
  }

  let url = `${BASE_URL}${accountId}/insights/?access_token=${process.env.FACEBOOK_APP_KEY}&fields=${metrics[Platform.FACEBOOK_ADS].join(',')}`;
  
  if (dateType !== 'CUSTOM') {
    url += `&date_preset=${datePresets[dateType]}`;
  } else {
    url += `&time_range={"since":"${startDate}","until":"${endDate}"}`;
  }

  /*
  if (dateType === 'YEAR_TO_DATE') {
    url += '&time_increment=monthly';
  }
  */

  const res = await fetch(url);
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  const reports: FacebookAdsReport['data'] = json.data.map((data: FacebookResponseData) => ({
    startDate: data.date_start,
    endDate: data.date_stop,
    impressions: data.impressions,
    reach: data.reach,
    cpc: roundWithPrecision(data.cpc),
    ctr: roundWithPrecision(data.ctr),
    outboundClicks: data.outbound_clicks[0].value,
    costPerOutboundClick: roundWithPrecision(data.cost_per_outbound_click[0].value)
  }));

  return reports;
};

export const getFbMetric = async ({
  accountId,
  startDate,
  endDate,
  metric
}: Omit<FacebookRequestArgs, 'dateType'> & { metric: string }) => {
  const metricName = metric.toLowerCase().replace(/\//g, 'per').replace(/ /g, '_');
  const url = `${BASE_URL}${accountId}/insights/?access_token=${process.env.FACEBOOK_APP_KEY}&fields=${metricName}&time_range={"since":"${startDate}","until":"${endDate}"}&time_increment=1`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data.map((entry: MetricData) => {
    return {
      date: entry.date_start,
      value: entry[metricName][0].value
    };
  });
};