import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Friend
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Friend on the backend
export type ParameterizedFriend<T> = {
  _id:Types.ObjectId;
  userId:T;
  friends: Array<T>;
  friendMe: Array<T>;
};

export type Friend = ParameterizedFriend<Types.ObjectId>;
export type PopulatedFriend = ParameterizedFriend<User>;

// Mongoose schema definition for interfacing with a MongoDB table
// Friends stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FriendSchema = new Schema<Friend>({
  // The user id of the Friend model
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // A list of users that the user is friending
  friends: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // A list of users that are friending the user
  friendMe: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
});

const FriendModel = model<Friend>('Friend', FriendSchema);
export default FriendModel;