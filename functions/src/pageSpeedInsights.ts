import { connect, disconnect } from 'mongoose';
import { format } from 'date-fns';

import Client from './models/Client';
import batchRequests from './utils/batchRequest';
import { uploadData } from './utils/bigQuery';

interface PageSpeedReport {
  lighthouseResult: {
    configSettings: {
      emulatedFormFactor: 'desktop' | 'mobile'
    }
    audits: {
      'first-contentful-paint': {
        displayValue: string
      }
      'speed-index': {
        displayValue: string
      }
      'interactive': {
        displayValue: string
      }
      'first-meaningful-paint': {
        displayValue: string
      }
      'first-cpu-idle': {
        displayValue: string
      }
      'estimated-input-latency': {
        displayValue: string
      }
    }
  }
}

interface PageSpeedRequest {
  id: string
  url: string
}

const DB_URI = process.env.DB_URI || '';
const KEY = process.env.KEY || '';

const BASE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed/?url=';

const parseValue = (val: string) => {
  if (!val || isNaN(parseFloat(val.replace(/,|s|ms/g, '')))) return 0;
  return parseFloat(val.replace(/,|s|ms/g, ''));
};

export const updatePageSpeedInsights = async () => {
  await connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  const clients = await Client.find({ pagespeedUrls: { $exists: true, $ne: [] } });
  
  const urlMap: { [key: string]: string } = {};

  const requests = clients.reduce((allUrls: PageSpeedRequest[], client) => {
    return allUrls.concat(client.pagespeedUrls.reduce((clientUrls: PageSpeedRequest[], url) => {
      urlMap[`${BASE_URL}${encodeURIComponent(url)}&key=${KEY}&strategy=desktop`] = url;
      urlMap[`${BASE_URL}${encodeURIComponent(url)}&key=${KEY}&strategy=mobile`] = url;

      return clientUrls.concat([
        { id: client.id, url: `${BASE_URL}${encodeURIComponent(url)}&key=${KEY}&strategy=desktop` },
        { id: client.id, url: `${BASE_URL}${encodeURIComponent(url)}&key=${KEY}&strategy=mobile` }
      ]);
    }, []));
  }, []);

  const data: any = [];
  
  await batchRequests({
    requests,
    cb: (id, url, res: PageSpeedReport) => {
      try {
        const match = url.match(/\w+$/);
        
        data.push({
          client_id: id,
          date: format(new Date(), 'yyyy-MM-dd'),
          url: urlMap[url],
          device:  match ? match[0] : res.lighthouseResult.configSettings.emulatedFormFactor,
          first_contentful_paint: parseValue(res.lighthouseResult.audits['first-contentful-paint'].displayValue),
          speed_index: parseValue(res.lighthouseResult.audits['speed-index'].displayValue),
          time_to_interactive: parseValue(res.lighthouseResult.audits['interactive'].displayValue),
          first_meaningful_paint: parseValue(res.lighthouseResult.audits['first-meaningful-paint'].displayValue),
          first_cpu_idle: parseValue(res.lighthouseResult.audits['first-cpu-idle'].displayValue),
          estimated_input_latency: parseValue(res.lighthouseResult.audits['estimated-input-latency'].displayValue)
        });
      } catch (e) {
        console.log('Request Error: ', JSON.stringify(e, null, 2));
        console.log('Response: ', JSON.stringify(res, null, 2));
      }
    }
  });

  await uploadData({
    dataset: 'WolfgangAnalytics',
    table: 'PageSpeedInsights',
    rows: data
  });
  await disconnect();
};