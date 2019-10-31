if (process.env.NODE_ENV !== 'production') require('dotenv').config();

import * as functions from 'firebase-functions';

import { updatePageSpeedInsights } from './pageSpeedInsights';

exports.updatePageSpeedInsights = functions
  .region('europe-west2')
  .pubsub.schedule('every monday 12:00')
  .timeZone('UTC')
  .onRun(async context => {
    await updatePageSpeedInsights();
  });