import { gql, makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';

import userTypes from './typeDefs/user';
import userResolvers from './resolvers/user';
import clientTypes from './typeDefs/client';
import clientResolvers from './resolvers/client';
import googleAnalyticsTypes from './typeDefs/googleAnalytics';
import googleAnalyticsResolvers from './resolvers/googleAnalytics';
import googleAdsTypes from './typeDefs/googleAds';
import googleAdsResolvers from './resolvers/googleAds';
import facebookAdsTypes from './typeDefs/facebookAds';
import facebookAdsResovers from './resolvers/facebookAds';

const root = gql`  
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const typeDefs = [
  root,
  userTypes,
  clientTypes,
  googleAnalyticsTypes,
  googleAdsTypes,
  facebookAdsTypes
];

const resolvers = merge(
  userResolvers,
  clientResolvers,
  googleAnalyticsResolvers,
  googleAdsResolvers,
  facebookAdsResovers
);

// @ts-ignore
export default makeExecutableSchema({ typeDefs, resolvers });