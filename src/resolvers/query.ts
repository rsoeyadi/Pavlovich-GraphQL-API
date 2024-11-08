import { pool } from '../db/pool';
import { PromptType } from '../schema/types/PromptType';
import { GraphQLList } from 'graphql';

export const getPrompts = {
  type: new GraphQLList(PromptType),
  async resolve() {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT * from prompts');
      client.release();
      return res.rows;
    } catch (err) {
      console.error('Error: ', err);
      throw new Error("Couldn't fetch data");
    }
  }
};
