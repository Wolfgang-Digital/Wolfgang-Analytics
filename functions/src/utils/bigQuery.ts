import { BigQuery } from '@google-cloud/bigquery';

interface Args {
  dataset: string
  table: string
  rows: any
}

export const googleConfig = {
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: decodeURIComponent(process.env.PRIVATE_KEY || '')
  },
  projectId: 'project-id-4791371014168354215',
  scopes: [
    'https://www.googleapis.com/auth/bigquery',
    'https://www.googleapis.com/auth/bigquery.insertdata',
    'https://www.googleapis.com/auth/spreadsheets'
  ]
};

const bigQuery = new BigQuery(googleConfig);

export const uploadData = async ({ dataset, table, rows }: Args) => {
  try {
    await bigQuery
      .dataset(dataset)
      .table(table)
      .insert(rows);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
};