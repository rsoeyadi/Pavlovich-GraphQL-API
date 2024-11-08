import { pool } from '../db/pool';
import { PromptType } from '../schema/types/PromptType';
import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

interface AddPromptArgsType {
  prompt_text: string;
}

interface DeletePromptsArgsType {
  id: number;
}

interface IncrementPromptLikesType {
  id: number;
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

export const deletePrompt = {
  type: PromptType,
  args: {
    id: { type: GraphQLInt },
  },
  async resolve(_: any, args: DeletePromptsArgsType) {
    const { id } = args;
    try {
      const client = await pool.connect();
      const res = await client.query('DELETE FROM prompts WHERE id = $1 RETURNING *', [id]);
      client.release();
      return res.rows;
    } catch (err) {
      console.error('Error: ', err);
      throw new Error('Trouble adding that prompt to the database!');
    }
  }
};

export const deleteAllPrompts = {
  type: PromptType,
  async resolve(): Promise<any> {
    try {
      const client = await pool.connect();
      const res = await client.query('DELETE FROM prompts')
      client.release()
      console.log(typeof res.rows)
      return res.rows

    } catch (err) {
      console.error('Error: ', err);
      throw new Error('Trouble adding that prompt to the database!');
    }
  }
}

export const incrementPromptLikes = {
  type: PromptType,
  args: {
    id: { type: GraphQLInt },
  },
  async resolve(_: any, args: IncrementPromptLikesType) {
    const { id } = args
    try {
      const client = await pool.connect()
      const res = await client.query('UPDATE prompts SET likes_counter = likes_counter + 1 WHERE id = $1 RETURNING *', [id]);
      return res
    } catch (err) {
      console.error('Error: ', err);
      throw new Error('Trouble incrementing the likes count');
    }
  }
}
