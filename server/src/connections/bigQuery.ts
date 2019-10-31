import { BigQuery } from '@google-cloud/bigquery';

import { googleConfig } from '../config';
import { GoogleAnalyticsReport } from '../types';
import { toTitleCase } from '../utils/helpers';

export interface QueryArgs {
  dataset: string
  table: string
}

const bigQuery = new BigQuery(googleConfig);

export const getPresetReports = async ({ dataset, table }: QueryArgs) => {
  const query = `SELECT * FROM ${dataset}.${table}`;
  const [rows] = await bigQuery.query(query);

  console.log(JSON.stringify(rows, null, 2));
  return rows;
};

const uploadData = async ({ dataset, table, rows }: {
  dataset: string
  table: string
  rows: any
}) => {
  try {
    await bigQuery
      .dataset(dataset)
      .table(table)
      .insert(rows);
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const uploadGoogleAnalytics = async (data: GoogleAnalyticsReport[]) => {
  const rows = data.map(report => ({
    client_id: report.clientId,
    view_id: report.viewId,
    start_date: report.startDate,
    end_date: report.endDate,
    range: report.dateType,
    channel: report.channel,
    sessions: report.data[0].sessions,
    transactions: report.data[0].transactions,
    conversion_rate: report.data[0].conversionRate,
    goal_completions: report.data[0].goalCompletions,
    goal_conversion_rate: report.data[0].goalConversionRate
  }));

  return await uploadData({ 
    dataset: 'GoogleAnalytics', 
    table: toTitleCase(data[0].dateType, '_', ''), 
    rows
  });
};

export const uploadYearlyGoogleAnalytics = async (data: GoogleAnalyticsReport[]) => {
  const rows = data.reduce((result, report) => {
    return result.concat(report.data.map(reportData => ({
      client_id: report.clientId,
      view_id: report.viewId,
      year: reportData.dimensions[0].value,
      month: reportData.dimensions[1].value,
      channel: report.channel,
      sessions: reportData.sessions,
      transactions: reportData.transactions,
      conversion_rate: reportData.conversionRate,
      goal_completions: reportData.goalCompletions,
      goal_conversion_rate: reportData.goalConversionRate
    })))
  }, []);

  return await uploadData({ 
    dataset: 'GoogleAnalytics', 
    table: toTitleCase(data[0].dateType, '_', ''), 
    rows
  });
};