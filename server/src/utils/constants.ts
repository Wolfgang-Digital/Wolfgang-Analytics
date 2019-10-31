import { Platform, Channel } from '../types';

export const metrics: { [key in Platform]: string[] } = {
  [Platform.GOOGLE_ANALYTICS]: [
    'ga:sessions',
    'ga:transactions',
    'ga:transactionsPerSession',
    'ga:goalCompletionsAll',
    'ga:goalConversionRateAll'
  ],
  [Platform.GOOGLE_ADS]: [
    'ga:adClicks',
    'ga:impressions',
    'ga:CTR',
    'ga:CPC',
    'ga:adCost',
    'ga:transactions * ga:revenuePerTransaction',
    'ga:costPerConversion',
    'ga:ROAS'
  ],
  [Platform.FACEBOOK_ADS]: [
    'impressions',
    'reach',
    'cpc',
    'ctr',
    'outbound_clicks',
    'cost_per_outbound_click'
  ]
};

export const filters: { [key in Channel]: string[] } = {
  [Channel.ALL]: [''],
  [Channel.ORGANIC]: ['ga:sourceMedium=@organic'],
  [Channel.SOCIAL]: [
    'ga:sourceMedium=@facebook / social',
    'ga:sourceMedium=@social / facebook',
    'ga:sourceMedium=@instagram / social',
    'ga:sourceMedium=@instagram / cpc',
    'ga:sourceMedium=@social / instagram',
    'ga:sourceMedium=@paidsocial / facebook',
    'ga:sourceMedium=@facebook / facebook',
    'ga:sourceMedium=@facebook1 / paidsocial'
  ],
  [Channel.PAID_SEARCH]: ['ga:sourceMedium=@cpc']
};