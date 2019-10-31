import { gql } from 'apollo-server-express';

export default gql`
  type GoogleAdsData {
    dimensions: [Dimension!]
    clicks: Int
    impressions: Int
    ctr: Float
    cpc: Float
    cost: Float
    totalConversionValue: Float
    costPerConversion: Float
    roas: Float
  }

  type GoogleAdsReport {
    clientId: ID!
    viewId: ID!
    platform: String!
    dateType: String!
    startDate: String!
    endDate: String!
    data: [GoogleAdsData!]
  }

  input AdwordsRequestArgs {
    clientId: String!
    viewId: String!
    dateType: String!
    startDate: String
    endDate: String
    dimensions: [String!]
  }

  extend type Query {
    getGoogleAdsReport(args: AdwordsRequestArgs!): GoogleAdsReport
  }
`;