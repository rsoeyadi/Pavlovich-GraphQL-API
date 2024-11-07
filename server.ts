import express from 'express'
import { createHandler } from 'graphql-http/lib/use/express';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import 'dotenv/config'
import pg from 'pg'

// create a pool to reuse connections instead of creating direct connections for every request
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
})

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // just used to uniquely identify for debugging purposes (only for server)
    fields: {
      hello: {
        type: GraphQLString,
        resolve(): string {
          return 'world';
        },
      },
    }
  })
})

var app = express() // using express to create HTTP server
app.use('/graphql', createHandler({ schema })); // this will route requests to /graphql to our createHandler() function
app.listen(4000, (): void => {
  console.log("Running on port 4000")
})
