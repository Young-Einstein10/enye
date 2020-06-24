const functions = require("firebase-functions");
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ctrl = require("./controllers");

const typeDefs = gql`
  type User {
    id: ID!
    fullname: String
    email: String
    createdAt: String
    photoURL: String
    displayName: String
    searchHistory: [SearchType]
  }

  type SearchUserType {
    uid: ID!
    email: String
  }

  type SearchType {
    id: ID
    address: String
    radius: Int
    searchType: String
    createdOn: String
    user: SearchUserType
  }

  type Query {
    users: [User]
    user(id: ID!): [User]
    searches: [SearchType]
    search(id: ID!): [SearchType]
  }

  type Mutation {
    addNewSearch(
      address: String
      radius: Int
      searchType: String
      createdOn: String
      user: UserSearchType
    ): [SearchType]
  }

  input UserSearchType {
    uid: ID!
    email: String
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return ctrl.getAllUsers();
    },
    user: (parent, args, context, info) => {
      return ctrl.getSingleUser(args.id);
    },
    searches: () => {
      return ctrl.getAllSearches();
    },
    search: (parent, args, context, info) => {
      return ctrl.getAllSearches(args.id);
    },
  },
  Mutation: {
    addNewSearch: async (parent, args, context, info) => {
      args.createdOn = new Date();
      const newSearch = await ctrl.addSearchToDB(args);
      return newSearch;
    },
  },
};

const createGraphQLServer = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  // Pass schema definition and resolvers to the
  // ApolloServer constructor
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });

  // Launch the server
  apolloServer.applyMiddleware({ app, path: "/", cors: true });

  return app;
};

const server = createGraphQLServer();

exports.api = functions.https.onRequest(server);
