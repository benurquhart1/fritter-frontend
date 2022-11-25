import { Freet } from '../freet/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Types.ObjectId;
  user: Types.ObjectId;
};

export type PopulatedLike = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  user: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  // The author userId
  freet: {
    // the freet which the like is on
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // the user who issued the like
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref:'User'
  },
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
