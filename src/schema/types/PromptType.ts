import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';

export const PromptType = new GraphQLObjectType({
  name: 'Prompt',
  fields: {
    id: { type: GraphQLInt },
    prompt_text: { type: GraphQLString },
    created_at: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    likes_counter: { type: GraphQLInt },
  }
});
