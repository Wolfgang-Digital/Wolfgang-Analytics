import { gql } from 'apollo-server-express';

export default gql`
  type Client {
    id: ID!
    name: String!
    services: [String!]
    tier: Int
    mainViewId: String
    industry: String!
    leads: [User!]
    team: [User!]
    gaAccount: String!
    facebookAdsId: String
    seoMonitorId: String
    pagespeedUrls: [String!]
    views: [View!]
    goals: [Goal!]
    kpis: [Kpi!]
    googleAnalytics(args: ClientAnalyticsArgs!): GoogleAnalyticsData
    googleAds(args: DateArgs!): GoogleAdsData
    facebookAds(args: DateArgs!): FacebookAdsData
  }

  type Kpi {
    id: ID!
    name: String
  }

  input ClientAnalyticsArgs {
    dateType: String!
    startDate: String
    endDate: String
    channel: String!
    dimensions: [String!]
  }

  input DateArgs {
    dateType: String!
    startDate: String
    endDate: String
  }

  input CreateClientArgs {
    id: ID
    name: String!
    services: [String!]
    leads: [String!]
    tier: Int!
    mainViewId: String
    industry: String!
    team: [String!]
    gaAccount: String!
    views: [ViewArgs!]
    facebookAdsId: String
    seoMonitorId: String
    pagespeedUrls: [String!]
  }

  input ViewArgs {
    id: ID!
    accountId: ID!
    name: String!
    webPropertyId: ID!
    websiteUrl: String!
  }

  input ClientFilters {
    services: [String!]
    platform: String
    industry: String
    tier: Int
    page: Int
  }

  extend type Query {
    getClients(filters: ClientFilters): [Client]
    getClientById(id: ID!): Client
    getAccounts: [String!]
  }

  extend type Mutation {
    createClient(args: CreateClientArgs!): Client
    addView(clientId: ID!, args: ViewArgs!): Client
    editClient(args: CreateClientArgs!): Client
  }
`;