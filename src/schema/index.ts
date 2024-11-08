import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { getPrompts } from '../resolvers/query';
import { addPrompt, deletePrompt, deleteAllPrompts, incrementPromptLikes } from '../resolvers/mutation';

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
      deletePrompt,
      deleteAllPrompts,
      incrementPromptLikes,
    },
  }),
});
