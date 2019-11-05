require('dotenv').config();

import { updatePageSpeedInsights } from '../pageSpeedInsights';

updatePageSpeedInsights().then(() => console.log('Complete')).catch(console.log);