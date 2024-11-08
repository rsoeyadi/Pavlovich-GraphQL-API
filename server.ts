import express from 'express'
import { createHandler } from 'graphql-http/lib/use/express';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import 'dotenv/config'
import pg from 'pg'

var { ruruHTML } = require("ruru/server") // this is the explorer recommended in the graphql docs

// create a pool to reuse connections instead of creating direct connections for every request
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
})

const PromptType = new GraphQLObjectType({
  name: 'Prompt',
  fields: {
    id: { type: GraphQLInt },
    prompt_text: { type: GraphQLString },
    created_at: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
  }
})

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // just used to uniquely identify for debugging purposes (only for server)
    fields: {
      getPrompts: {
        type: new GraphQLList(PromptType),
        async resolve() {
          try {
            const client = await pool.connect()
            const res = await client.query("SELECT * from prompts")
            client.release()
            return res.rows;
          } catch (err) {
            console.log('Error: ', err);
            throw new Error('Couldn\'t fetch data')
          }
        },
      },
    }
  })
})

var app = express() // using express to create HTTP server
app.use('/graphql', createHandler({ schema })); // this will route requests to /graphql to our createHandler() function
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})
app.listen(4000, (): void => {
  console.log("Listening on port: 4000")
})
