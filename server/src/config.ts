if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const DEV = process.env.NODE_ENV !== 'production';

export const PORT = process.env.PORT || 8000;

export const UPLOAD_LOG_SHEET_ID = '1SLstPqq5sCcNVubVa8A23OzwXn-dVVW1O5E34FzwBsU';

export const oauthConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
};

export const mongoDbConfig = {
  uri: process.env.MONGODB_URI, 
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
};

export const googleConfig = {
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: decodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
  },
  projectId: 'project-id-4791371014168354215',
  scopes: [
    'https://www.googleapis.com/auth/bigquery',
    'https://www.googleapis.com/auth/bigquery.insertdata',
    'https://www.googleapis.com/auth/spreadsheets'
  ]
};

export const sessionConfig = {
  maxAge: DEV ? MS_PER_DAY * 7 : MS_PER_DAY,
  keys: [process.env.SESSION_SECRET]
};

export const corsWhitelist = DEV
  ? ['http://localhost:3000']
  : ['https://analytics.netlify.com'];