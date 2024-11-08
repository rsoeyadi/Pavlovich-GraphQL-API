import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './src/schema';
var { ruruHTML } = require('ruru/server');

const app = express();

app.use('/graphql', createHandler({ schema }));
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.listen(4000, () => {
  console.log('Listening on port: 4000');
});
