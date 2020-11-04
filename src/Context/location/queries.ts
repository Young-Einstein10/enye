import { gql } from "apollo-boost";

const GetUserDetailsQuery = gql`
  query GetUserDetails($id: ID!) {
    user(id: $id) {
      id
      fullname
      email
      searchHistory {
        id
        address
        searchType
        radius
        createdOn
      }
    }
  }
`;

const ADD_NEW_SEARCH = gql`
  mutation addNewSearch(
    $address: String!
    $radius: Int!
    $searchType: String!
    $user: UserSearchType
  ) {
    addNewSearch(
      address: $address
      radius: $radius
      searchType: $searchType
      user: $user
    ) {
      id
      address
      radius
      searchType
      createdOn
      user {
        uid
        email
      }
    }
  }
`;

export { GetUserDetailsQuery, ADD_NEW_SEARCH };
