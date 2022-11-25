import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type ParameterizedFollow<T> = {
  _id:Types.ObjectId;
  userId:T;
  following: Array<T>;
  followers: Array<T>;
};

export type Follow = ParameterizedFollow<Types.ObjectId>;
export type PopulatedFollow = ParameterizedFollow<User>;

// Mongoose schema definition for interfacing with a MongoDB table
// Follows stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // The user id of the follow model
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // A list of users that the user is following
  following: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // A list of users that are following the user
  followers: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;