export const BASE_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:8000' : 'https://wolfganganalytics.herokuapp.com';

export const INDUSTRIES = [
  'Lead Gen - B2B',
  'Lead Gen - B2C',
  'Retail',
  'Travel & Tourism',
  'Finance',
  'Health & Beauty',
  'Property',
  'Training & Education',
  'Charity',
  'Media',
  'Legal',
  'Energy',
  'Automotive'
].sort();

export const tableHeaders = {
  'Google Analytics': [
    { name: 'Client ID', options: { display: false, filter: false, sort: false } },
    { name: 'Name', options: { filter: true, sort: true } },
    { name: 'Industry', options: { filter: true, sort: true } },
    { name: 'Tier', options: { filter: true, sort: true } },
    { name: 'Sessions', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Transactions', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Goal Completions', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Goal Conversion Rate', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
  ],
  'Google Ads': [
    { name: 'Client ID', options: { display: false, filter: false, sort: false } },
    { name: 'Name', options: { filter: true, sort: true } },
    { name: 'Industry', options: { filter: true, sort: true } },
    { name: 'Tier', options: { filter: true, sort: true } },
    { name: 'Clicks', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Impressions', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'CTR', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'CPC', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Cost', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Conversion Value', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Cost / Conversion', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'ROAS', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
  ],
  'Facebook Ads': [
    { name: 'Client ID', options: { display: false, filter: false, sort: false } },
    { name: 'Name', options: { filter: true, sort: true } },
    { name: 'Industry', options: { filter: true, sort: true } },
    { name: 'Tier', options: { filter: true, sort: true } },
    { name: 'Impressions', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Reach', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'CPC', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'CTR', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Outbound Clicks', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
    { name: 'Cost / Outbound Click', options: { filter: false, sort: true } },
    { name: 'Δ%', options: { filter: false, sort: true } },
  ]
};

export const reportMetrics = {
  'Google Analytics': [
    { key: 'sessions', label: 'Sessions', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'transactions', label: 'Transactions', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'goalCompletions', label: 'Goal Completions', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'goalConversionRate', label: 'Goal Conversion Rate', invertColours: false, prefix: '', suffix: '%', aggregate: 'mean' }
  ],
  'Google Ads': [
    { key: 'clicks', label: 'Clicks', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'impressions', label: 'Impressions', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'ctr', label: 'CTR', invertColours: false, prefix: '', suffix: '%', aggregate: 'mean' },
    { key: 'cpc', label: 'CPC', invertColours: true, prefix: '€', suffix: '', aggregate: 'mean' },
    { key: 'cost', label: 'Cost', invertColours: true, prefix: '€', suffix: '', aggregate: 'sum' },
    { key: 'totalConversionValue', label: 'Conversion Value', invertColours: false, prefix: '€', suffix: '', aggregate: 'sum' },
    { key: 'costPerConversion', label: 'Cost / Conversion', invertColours: true, prefix: '€', suffix: '', aggregate: 'mean' },
    { key: 'roas', label: 'ROAS', invertColours: false, prefix: '', suffix: '%', aggregate: 'mean' }
  ],
  'Facebook Ads': [
    { key: 'impressions', label: 'Impressions', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'reach', label: 'Reach', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'cpc', label: 'CPC', invertColours: true, prefix: '€', suffix: '', aggregate: 'mean' },
    { key: 'ctr', label: 'CTR', invertColours: false, prefix: '', suffix: '%', aggregate: 'mean' },
    { key: 'outboundClicks', label: 'Outbound Clicks', invertColours: false, prefix: '', suffix: '', aggregate: 'sum' },
    { key: 'costPerOutboundClick', label: 'Cost / Outbound Click', invertColours: true, prefix: '€', suffix: '', aggregate: 'mean' }
  ]
};

// Can't remember why I did this. Remove?
export const kpiMetrics = {
  'Google Analytics': [
    ...reportMetrics['Google Analytics']  
  ],
  'Google Ads': [
    ...reportMetrics['Google Ads']
  ],
  'Facebook Ads': [
    ...reportMetrics['Facebook Ads']
  ]
};