import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import session from 'cookie-session';

import { DEV, PORT, mongoDbConfig, sessionConfig, corsWhitelist } from './config';
import schema from './graphql/schema';
import passport from './middleware/passport';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);

const server = new ApolloServer({
  schema,
  introspection: true,
  context: async ({ req }) => {
    if (!req.user) {
      throw new AuthenticationError('You must be logged in to use this service');
    }
    return { user: req.user };
  }
});

server.applyMiddleware({
  app,
  path: '/api',
  cors: {
    credentials: true,
    origin: corsWhitelist
  }
});

app.listen(PORT, () => {
  if (DEV) console.log(`Graphiql running on http://localhost:${PORT}/api`);
})

mongoose.connect(mongoDbConfig.uri, mongoDbConfig.options, () => {
  if (DEV) console.log('Connected to MongoDB');
}).catch(e => {
  if (DEV) console.log('Error connecting to MongoDB:', e);
});