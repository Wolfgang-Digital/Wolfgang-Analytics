import { gql } from 'apollo-boost';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser: getCurrentUser {
      firstName
      lastName
      email
      roles
      permissions
      profilePicture
    }
  }
`;

export const GET_USERS = gql`
  query GetUsernames {
    usernames: getUsers {
      id
      firstName
      lastName
      profilePicture
    }
  }
`;