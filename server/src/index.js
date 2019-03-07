const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Vendor = require('./resolvers/Vendor')
const Customer = require('./resolvers/Customer')
const Post = require('./resolvers/Post')

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
  Vendor,
  Customer,
  Post,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma,
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
