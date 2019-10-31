export type Unpacked<T> = T extends (infer U)[] ? U : T

export interface WebProperty {
  id: string
  name: string
  accountId: string
  views: View[]
}

export interface View {
  id: string
  name: string
  accountId: string
  webPropertyId: string
  websiteUrl: string
}

export interface Goal {
  id: string
  viewId: string
  name: string
  goalType: 'URL_DESTINATION' | 'VISIT_TIME_ON_SITE' | 'VISIT_NUM_PAGES' | 'EVENT'
  value: number
  isActive?: boolean
  url?: string
}

export interface Kpi {
  type: string
}

export enum Channel {
  ALL = 'ALL',
  ORGANIC = 'ORGANIC',
  SOCIAL = 'SOCIAL',
  PAID_SEARCH = 'PAID_SEARCH'
}

export enum Services {
  SEO = 'SEO',
  PAID_SEARCH = 'PAID_SEARCH',
  PAID_SOCIAL = 'PAID_SOCIAL',
  CONTENT = 'CONTENT'
}

export enum Platform {
  GOOGLE_ANALYTICS = 'GOOGLE_ANALYTICS',
  GOOGLE_ADS = 'GOOGLE_ADS',
  FACEBOOK_ADS = 'FACEBOOK_ADS'
}

export interface Dimension {
  name: string
  value: any
}

export enum DateType {
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_30_DAYS_MOM = 'LAST_30_DAYS_MOM',
  LAST_30_DAYS_YOY = 'LAST_30_DAYS_YOY',
  LAST_MONTH = 'LAST_MONTH',
  LAST_MONTH_MOM = 'LAST_MONTH_MOM',
  LAST_MONTH_YOY = 'LAST_MONTH_YOY',
  YEAR_TO_DATE = 'YEAR_TO_DATE',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM'
}

export interface Report {
  clientId: string
  platform: Platform
  dateType: DateType
  startDate: Date | string
  endDate: Date | string
}

export interface GoogleAnalyticsReport extends Report {
  readonly platform: Platform.GOOGLE_ANALYTICS
  viewId: string
  channel: Channel
  data: {
    dimensions: Dimension[]
    sessions: number
    transactions: number
    conversionRate: number
    goalCompletions: number
    goalConversionRate: number
  }[]
}

export interface GoogleAdsReport extends Report {
  readonly platform: Platform.GOOGLE_ADS
  viewId: string
  data: {
    dimension?: Dimension
    clicks: number
    impressions: number
    ctr: number
    cpc: number
    cost: number
    totalConversionValue: number
    costPerConversion: number
    roas: number
  }[]
}

export interface FacebookAdsReport {
  readonly platform: Platform.FACEBOOK_ADS
  data: {
    startDate: Date | string
    endDate: Date | string
    impressions: number
    reach: number
    cpc: number
    ctr: number
    outboundClicks: number
    costPerOutboundClick: number
  }[]
}