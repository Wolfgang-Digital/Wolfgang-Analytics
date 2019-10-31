import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profilePicture: String
    roles: [String!]
    permissions: [String!]
    isVerified: Boolean
  }

  extend type Query {
    getCurrentUser: User
    getUsers: [User]
    getUserById(id: ID!): User
  }
`;