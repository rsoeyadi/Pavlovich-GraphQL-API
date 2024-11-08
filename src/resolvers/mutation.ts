import { pool } from '../db/pool';
import { PromptType } from '../schema/types/PromptType';
import { GraphQLObjectType, GraphQLString } from 'graphql';

interface AddPromptArgsType {
  prompt_text: string;
}

export const addPrompt = {
  type: PromptType,
  args: {
    prompt_text: { type: GraphQLString },
  },
  async resolve(_: any, args: AddPromptArgsType) {
    const { prompt_text } = args;
    try {
      const client = await pool.connect();
      await client.query('UPDATE prompts SET is_active = false');
      const res = await client.query(
        'INSERT INTO prompts (prompt_text, created_at, is_active) VALUES ($1, NOW(), true) RETURNING *',
        [prompt_text]
      );
      client.release();
      return res.rows[0];
    } catch (err) {
      console.error('Error: ', err);
      throw new Error('Trouble adding that prompt to the database!');
    }
  }
};
