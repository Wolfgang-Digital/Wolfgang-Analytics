import { gql } from 'apollo-boost';

const fragments = {
  gaReport: gql`
    fragment GaReport on GoogleAnalyticsData {
      sessions
      transactions
      goalCompletions
      goalConversionRate
    }
  `,
  adwordsReport: gql`
    fragment AdwordsReport on GoogleAdsData {
      clicks
      impressions
      ctr
      cpc
      cost
      totalConversionValue
      costPerConversion
      roas
    }
  `,
  facebookReport: gql`
    fragment FacebookReport on FacebookAdsData {
      impressions
      reach
      cpc
      ctr
      outboundClicks
      costPerOutboundClick  
    }
  `
};

export const GET_GA_ACCOUNTS = gql`
  query GetGaAccounts {
    accounts: getAccounts
  }
`;

export const GET_GA_PROPERTIES = gql`
  query GetGaProperties($email: String!) {
    properties: getProperties(email: $email) {
      id
      name
      accountId
      views {
        id
        accountId
        name
        webPropertyId
        websiteUrl
      }
    }
  }
`;

export const GET_CLIENT_SNIPPETS = gql`
  query GetClientSnippets {
    clients: getClients {
      id
      name
    }
  }
`;

export const GET_CLIENT_GA_REPORTS = gql`
  query GetClientReports($filters: ClientFilters!, $args: ClientAnalyticsArgs!, $comparisonArgs: ClientAnalyticsArgs!) {
    clients: getClients(filters: $filters) {
      id
      name
      tier
      industry
      data: googleAnalytics(args: $args) {
        ...GaReport
      }
      dataComparison: googleAnalytics(args: $comparisonArgs) {
        ...GaReport
      }
    }
  }
  ${fragments.gaReport}
`;

export const GET_CLIENT_ADWORDS_REPORTS = gql`
  query GetClientReports($filters: ClientFilters!, $args: DateArgs!, $comparisonArgs: DateArgs!) {
    clients: getClients(filters: $filters) {
      id
      name
      tier
      industry
      data: googleAds(args: $args) {
        ...AdwordsReport
      }
      dataComparison: googleAds(args: $comparisonArgs) {
        ...AdwordsReport
      }
    }
  }
  ${fragments.adwordsReport}
`;

export const GET_FACEBOOK_ADS_REPORTS = gql`
  query GetFacebookAdsReports($filters: ClientFilters!, $args: DateArgs!, $comparisonArgs: DateArgs!) {
    clients: getClients(filters: $filters) {
      id
      name
      tier
      industry
      data: facebookAds(args: $args) {
        ...FacebookReport
      }
      dataComparison: facebookAds(args: $comparisonArgs) {
        ...FacebookReport
      }
    }
  }
  ${fragments.facebookReport}
`;

export const ADD_CLIENT = gql`
  mutation AddClient($args: CreateClientArgs!) {
    client: createClient(args: $args) {
      id
      name
    }
  }
`;

export const EDIT_CLIENT = gql`
  mutation EditClient($args: CreateClientArgs!) {
    client: editClient(args: $args) {
      id
      name
    }
  }
`;

export const GET_GOALS_FROM_VIEWS = gql`
  query GetGoalsFromViews($email: String!, $viewIds: [ViewInput!]!) {
    goals: getGoalsFromIds(email: $email, viewIds: $viewIds) {
      id
      viewId
      name
      value
      url
    }
  }
`;

export const GET_CLIENT_INFO = gql`
  query GetClientInfo($id: ID!) {
    client: getClientById(id: $id) {
      id
      name
      services
      tier
      industry
      gaAccount
      mainViewId
      leads {
        id
        firstName
        lastName
        profilePicture
      }
      team {
        id
        firstName
        lastName
        profilePicture
      }
      facebookAdsId
      seoMonitorId
      pagespeedUrls
      views {
        id
        accountId
        name
        websiteUrl
        webPropertyId
      }
      goals {
        id
        viewId
        name
        url
      }
    }
  }
`;

export const GET_GOAL_COMPLETIONS = gql`
  query GetGoalCompletions($args:AnalyticsRequestArgs!) {
    data: getClientGoalCompletions(args:$args) {
      metric
      viewId
      viewName
      goalId
      goalName
      url
      total
      values {
        date
        value
      }
    }
  }
`;

export const reportQueries = {
  'Google Analytics': GET_CLIENT_GA_REPORTS,
  'Google Ads': GET_CLIENT_ADWORDS_REPORTS,
  'Facebook Ads': GET_FACEBOOK_ADS_REPORTS
};