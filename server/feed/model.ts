import { PopulatedFreet } from '../freet/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a feed
 * DO NOT implement operations here ---> use collection file
 */

export enum Sort {date= 0, dateReversed, likes};

// Type definition for feed on the backend
export type Feed = {
  _id:Types.ObjectId;
  name:string;
  userId:Types.ObjectId;
  accounts: Array<Types.ObjectId>;
  sort:Sort;
};

export type PopulatedFeed = {
  _id:Types.ObjectId;
  name:string;
  userId:User;
  accounts: Array<User>;
  sort:Sort;
}


// Mongoose schema definition for interfacing with a MongoDB table
// Feeds stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FeedSchema = new Schema<Feed>({
  // The user id of the feed
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // the name of the feed/content group
  name: {
    type: Schema.Types.String,
    required: true,
  },  
  // A list of accounts whose posts are in the feed
  accounts: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // the current sorting method for the feed
  sort: {
    type: Number,
    required: true
  },
});

const FeedModel = model<Feed>('Feed', FeedSchema);
export default FeedModel;