const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const ctrl = require("./controllers");

const base_url =
  process.env.HOST || "http://localhost:5000/enye-d35c3/us-central1/api";

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    fullname: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    photoURL: { type: GraphQLString },
    displayName: { type: GraphQLString },
    searchHistory: { type: new GraphQLList(SearchType) },
  }),
});

// Search User Type
const SearchUserType = new GraphQLObjectType({
  name: "SearchUserType",
  fields: () => ({
    uid: { type: GraphQLString },
    email: { type: GraphQLString },
    photoURL: { type: GraphQLString },
    displayName: { type: GraphQLString },
  }),
});

// Search Type
const SearchType = new GraphQLObjectType({
  name: "Search",
  fields: () => ({
    id: { type: GraphQLID },
    address: { type: GraphQLString },
    radius: { type: GraphQLInt },
    searchType: { type: GraphQLString },
    createdOn: { type: GraphQLString },
    user: { type: SearchUserType },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: new GraphQLList(UserType),
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        // return axios
        //   .get(`${base_url}/user/${args.id}`)
        //   .then((res) => res.data)
        //   .catch((err) => console.log(err));
        return ctrl.getSingleUser(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        // return axios
        //   .get(`${base_url}/users`)
        //   .then((res) => res.data)
        //   .catch((err) => console.log(err));
        return ctrl.getAllUsers();
      },
    },
    searches: {
      type: new GraphQLList(SearchType),
      resolve(parentValue, args) {
        // return axios
        //   .get(`${base_url}/searches`)
        //   .then((res) => res.data)
        //   .catch((err) => console.log(err));
        return ctrl.getAllSearches();
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addNewSearch: {
      type: SearchType,
      args: {
        address: { type: new GraphQLNonNull(GraphQLString) },
        radius: { type: new GraphQLNonNull(GraphQLInt) },
        searchType: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .post(`${base_url}/api/search`, {
            address: args.address,
            radius: args.radius,
            searchType: args.searchType,
            createdAt: args.createdAt,
            user: args.user,
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
