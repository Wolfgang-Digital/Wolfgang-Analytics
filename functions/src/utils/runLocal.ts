require('dotenv').config();

import { updatePageSpeedInsights } from '../pageSpeedInsights';

const main = async () => {
  await updatePageSpeedInsights();
  console.log('Complete');
};

main();