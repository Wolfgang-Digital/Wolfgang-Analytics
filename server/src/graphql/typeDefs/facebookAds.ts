import { gql } from 'apollo-server-express';

export default gql`
  type FacebookAdsData {
    startDate: String!
    endDate: String!
    impressions: Int
    reach: Float
    cpc: Float
    ctr: Float
    outboundClicks: Int
    costPerOutboundClick: Float
  }

  type FacebookAdsReport {
    clientId: ID!
    platform: String!
    dateType: String!
    startDate: String!
    endDate: String!
    data: [FacebookAdsData!]
  }

  input FacebookRequestArgs {
    clientId: ID!
    dateType: String!
    startDate: String
    endDate: String
  }

  extend type Query {
    getFacebookAdsReport(args: FacebookRequestArgs!): FacebookAdsReport
  }
`;