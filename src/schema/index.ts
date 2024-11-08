import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { getPrompts } from '../resolvers/query';
import { addPrompt } from '../resolvers/mutation';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      getPrompts,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      addPrompt,
    },
  }),
});
