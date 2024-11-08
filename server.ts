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

// defining the shape of the prompt object
const PromptType = new GraphQLObjectType({
  name: 'Prompt',
  fields: {
    id: { type: GraphQLInt },
    prompt_text: { type: GraphQLString },
    created_at: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
  }
})

// here is the contract where we can define queries/mutation + resolvers
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
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      addPrompt: {
        type: PromptType,
        args: {
          prompt_text: { type: GraphQLString },
        },
        async resolve(_, args): Promise<typeof PromptType> { // the first parameter isn't being used here and we need to access the top level args of addPrompt()
          const { prompt_text } = args;
          try {
            const client = await pool.connect()
            await client.query("UPDATE prompts SET is_active = false")
            const res = await client.query('INSERT INTO prompts (prompt_text, created_at, is_active) VALUES ($1, NOW(), true) RETURNING *', [prompt_text])
            client.release()
            return res.rows[0]
          } catch (err) {
            throw new Error('Trouble adding that prompt to the database!')
          }
        }
      }
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
