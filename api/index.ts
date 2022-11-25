// This file must be in the /api folder for Vercel to detect it as a serverless function
import type {Request, Response} from 'express';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as userValidator from '../server/user/middleware';
import {userRouter} from '../server/user/router';
import {freetRouter} from '../server/freet/router';
import {followRouter} from '../server/follow/router';
import {favoriteRouter} from '../server/favorite/router';
import {friendRouter} from '../server/friend/router';
import {feedRouter} from '../server/feed/router';
import {likeRouter} from '../server/like/router';
import {contentGroupRouter} from '../server/contentGroup/router';
import { followGroupRouter } from '../server/followGroup/router';
import MongoStore from 'connect-mongo';

// Load environmental variables
dotenv.config({});

// Connect to mongoDB
const mongoConnectionUrl = process.env.MONGO_SRV;
if (!mongoConnectionUrl) {
  throw new Error('Please add the MongoDB connection SRV as \'MONGO_SRV\'');
}

const client = mongoose
  .connect(mongoConnectionUrl)
  .then(m => {
    console.log('Connected to MongoDB');
    return m.connection.getClient();
  })
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message as string}`);
    throw new Error(err.message);
  });

mongoose.connection.on('error', err => {
  console.error(err);
});

// Initalize an express app
const app = express();

// Set the port
app.set('port', process.env.PORT || 3000);

// Log requests in the terminal
app.use(logger('dev'));

// Parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// Parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header)
app.use(express.urlencoded({extended: false}));

// Initialize cookie session
// https://www.npmjs.com/package/express-session#options
app.use(session({
  secret: '61040', // Should generate a real secret
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: client,
    dbName: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10 // Minutes
  })
}));

// This makes sure that if a user is logged in, they still exist in the database
app.use(userValidator.isCurrentSessionUserExists);

// Add routers from routes folder
app.use('/api/users', userRouter);
app.use('/api/freets', freetRouter);
app.use('/api/follow', followRouter);
app.use('/api/friend', friendRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/feed', feedRouter);
app.use('/api/like', likeRouter);
app.use('/api/contentGroup', contentGroupRouter);
app.use('/api/followGroup', followGroupRouter);

// Catch all the other routes and display error message
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Page not found'
  });
});

// Create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Express server running at http://localhost:${app.get('port') as number}`);
});
