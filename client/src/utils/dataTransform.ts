import { meanBy } from 'lodash';

interface ClientData<T> {
  id: string
  name: string
  industry: string
  tier: number
  data: T
  dataComparison: T
}

interface GaData {
  sessions: number
  transactions: number
  goalCompletions: number
  goalConversionRate: number
}

interface AdwordsData {
  clicks: number
  impressions: number
  ctr: number
  cpc: number
  cost: number
  totalConversionValue: number
  costPerConversion: number
  roas: number
}

interface FacebookData {
  impressions: number
  reach: number
  cpc: number
  ctr: number
  outboundClicks: number
  costPerOutboundClick: number
}

const dummyGaData = {
  sessions: '--',
  transactions: '--',
  goalCompletions: '--',
  goalConversionRate: '--'
};

const dummyAdwordsData = {
  clicks: '--',
  impressions: '--',
  ctr: '--',
  cpc: '--',
  cost: '--',
  totalConversionValue: '--',
  costPerConversion: '--',
  roas: '--'
};

const formatLargeNumber = (num: number, isPercent?: boolean) => {
  if (!num && num !== 0) return '--';
  
  if (num > 1000000) {
    const value = num / 1000000;
    return `${value.toFixed(2)}M`;
  } else if (num > 1000) {
    const value = num / 1000;
    return `${value.toFixed(0)}K`
  }
  return `${num.toLocaleString('en-GB')}${isPercent ? '%' : ''}`;
};

const getDelta = (a: number, b: number, toLocalString = true, nanReturn = '--') => {
  const value = ((a - b) / b);
  return (isNaN(value) || value === Infinity) ? nanReturn : toLocalString ? value.toLocaleString('en-GB', { style: 'percent' }) : value;
};

const getTableValue = (value: number | string, showFullNumbers: boolean, comparison?: number | string) => {
  return (!value || isNaN(value as number)) && value !== 0
    ? '--'
    : showFullNumbers
    ? value.toLocaleString('en-GB')
    : !!comparison
    ? getDelta(comparison as number, value as number)
    : formatLargeNumber(value as number);
};

export const formatGaReports = (data: ClientData<GaData>[], showFullNumbers: boolean) => {
  if (!data) return [];

  return data.map(({ id, name, industry, tier, data, dataComparison }) => {
    const _data = data || dummyGaData;
    const _dataComparison = dataComparison || dummyGaData;

    return [
      id,
      name,
      industry,
      tier,
      getTableValue(_data.sessions, showFullNumbers),
      getTableValue(_dataComparison.sessions, showFullNumbers, _data.sessions),
      getTableValue(_data.transactions, showFullNumbers),
      getTableValue(_dataComparison.transactions, showFullNumbers, _data.transactions),
      getTableValue(_data.goalCompletions, showFullNumbers),
      getTableValue(_dataComparison.goalCompletions, showFullNumbers, _data.goalCompletions),
      getTableValue(_data.goalConversionRate, showFullNumbers),
      getTableValue(_dataComparison.goalConversionRate, showFullNumbers, _data.goalConversionRate),
    ];
  });
};

export const formatAdwordsReports = (data: ClientData<AdwordsData>[], showFullNumbers: boolean) => {
  if (!data) return [];

  return data.map(({ id, name, industry, tier, data, dataComparison }) => {
    const _data = data || dummyAdwordsData;
    const _dataComparison = dataComparison || dummyAdwordsData;

    return [
      id,
      name,
      industry,
      tier,
      getTableValue(_data.clicks, showFullNumbers),
      getTableValue(_dataComparison.clicks, showFullNumbers, _data.clicks),
      getTableValue(_data.impressions, showFullNumbers),
      getTableValue(_dataComparison.impressions, showFullNumbers, _data.impressions),
      getTableValue(_data.ctr, showFullNumbers),
      getTableValue(_dataComparison.ctr, showFullNumbers, _data.ctr),
      getTableValue(_data.cpc, showFullNumbers),
      getTableValue(_dataComparison.cpc, showFullNumbers, _data.cpc),
      getTableValue(_data.cost, showFullNumbers),
      getTableValue(_dataComparison.cost, showFullNumbers, _data.cost),
      getTableValue(_data.totalConversionValue, showFullNumbers),
      getTableValue(_dataComparison.totalConversionValue, showFullNumbers, _data.totalConversionValue),
      getTableValue(_data.costPerConversion, showFullNumbers),
      getTableValue(_dataComparison.costPerConversion, showFullNumbers, _data.costPerConversion),
      getTableValue(_data.roas, showFullNumbers),
      getTableValue(_dataComparison.roas, showFullNumbers, _data.roas),
    ];
  });
};

export const formatFacebookReports = (data: ClientData<FacebookData>[], showFullNumbers: boolean) => {
  if (!data) return [];

  return data.map(({ id, name, industry, tier, data, dataComparison }) => {
    return [
      id,
      name,
      industry,
      tier,
      getTableValue(data.impressions, showFullNumbers),
      getTableValue(dataComparison.impressions, showFullNumbers, data.impressions),
      getTableValue(data.reach, showFullNumbers),
      getTableValue(dataComparison.reach, showFullNumbers, data.reach),
      getTableValue(data.cpc, showFullNumbers),
      getTableValue(dataComparison.cpc, showFullNumbers, data.cpc),
      getTableValue(data.ctr, showFullNumbers),
      getTableValue(dataComparison.ctr, showFullNumbers, data.ctr),
      getTableValue(data.outboundClicks, showFullNumbers),
      getTableValue(dataComparison.outboundClicks, showFullNumbers, data.outboundClicks),
      getTableValue(data.costPerOutboundClick, showFullNumbers),
      getTableValue(dataComparison.costPerOutboundClick, showFullNumbers, data.costPerOutboundClick),
    ];
  });
};

export const getAverages = (reports: ClientData<GaData | AdwordsData | FacebookData>[]) => {
  if (!reports || reports.length === 0) return null;

  const deltas = reports.map(({ data, dataComparison }) => {
    if (!data) return {};
    
    return Object.keys(data).reduce((result: any, key) => {
      // @ts-ignore
      result[key] = data && dataComparison ? getDelta(data[key], dataComparison[key], false, 0) : 0;
      return result;
    }, {});
  });

  return Object.keys(deltas[0]).reduce((result: any, key) => {
    const mean = meanBy(deltas, key).toLocaleString('en-GB', { style: 'percent' });
    result[key] = mean === '-0%' ? '0%' : mean;
    return result;
  }, {});
};

export const dataFormatters = {
  'Google Analytics': formatGaReports,
  'Google Ads': formatAdwordsReports,
  'Facebook Ads': formatFacebookReports
};