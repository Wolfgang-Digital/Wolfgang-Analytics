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
    { key: 'sessions', label: 'Sessions', invertColours: false },
    { key: 'transactions', label: 'Transactions', invertColours: false },
    { key: 'goalCompletions', label: 'Goal Completions', invertColours: false },
    { key: 'goalConversionRate', label: 'Goal Conversion Rate', invertColours: false }
  ],
  'Google Ads': [
    { key: 'clicks', label: 'Clicks', invertColours: false },
    { key: 'impressions', label: 'Impressions', invertColours: false },
    { key: 'ctr', label: 'CTR', invertColours: false },
    { key: 'cpc', label: 'CPC', invertColours: true },
    { key: 'cost', label: 'Cost', invertColours: true },
    { key: 'totalConversionValue', label: 'Conversion Value', invertColours: false },
    { key: 'costPerConversion', label: 'Cost / Conversion', invertColours: true },
    { key: 'roas', label: 'ROAS', invertColours: false }
  ],
  'Facebook Ads': [
    { key: 'impressions', label: 'Impressions', invertColours: false },
    { key: 'reach', label: 'Reach', invertColours: false },
    { key: 'cpc', label: 'CPC', invertColours: true },
    { key: 'ctr', label: 'CTR', invertColours: false },
    { key: 'outboundClicks', label: 'Outbound Clicks', invertColours: false },
    { key: 'costPerOutboundClick', label: 'Cost / Outbound Click', invertColours: true }
  ]
};

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