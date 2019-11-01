import { gql } from 'apollo-server-express';

export default gql`
  type WebProperty {
    id: ID!
    name: String!
    accountId: String!
    views: [View!]
  }

  type View {
    id: ID!
    name: String!
    accountId: String!
    webPropertyId: ID!
    websiteUrl: String!
  }

  type Goal {
    id: ID!
    viewId: ID!
    name: String!
    goalType: String!
    value: Float
    isActive: Boolean
    url: String
  }

  type GoalData {
    metric: String!
    viewId: String!
    viewName: String
    goalId: String!
    goalName: String
    url: String
    total: Float
    values: [GoalValue!]
  }

  type GoalValue {
    date: String!
    value: Float
  }

  type Dimension {
    name: String!
    value: String!
  }

  type GoogleAnalyticsData {
    dimensions: [Dimension!]
    sessions: Int
    transactions: Int
    conversionRate: Float
    goalCompletions: Int
    goalConversionRate: Float
  }

  type GoogleAnalyticsReport {
    clientId: ID!
    viewId: ID!
    platform: String!
    dateType: String!
    startDate: String!
    endDate: String!
    channel: String!
    data: [GoogleAnalyticsData!]
  }

  input AnalyticsRequestArgs {
    clientId: ID!
    viewId: ID
    dateType: String!
    startDate: String
    endDate: String
    channel: String!
    dimensions: [String!]
  }

  input ViewInput {
    id: ID!
    accountId: ID!
    webPropertyId: ID!
  }

  input QueryArgs {
    dataset: String!
    table: String!
  }

  extend type Query {
    getGoogleAnalyticsReport(args: AnalyticsRequestArgs!): GoogleAnalyticsReport
    getProperties(email: String!): [WebProperty]
    getGoals(clientId: ID!, viewId: String!): [Goal]
    getGoalsFromIds(email: String!, viewIds: [ViewInput!]!): [Goal]
    getPresetReports(args: QueryArgs!): String
    getClientGoalCompletions(args: AnalyticsRequestArgs!): [GoalData]
  }
`;