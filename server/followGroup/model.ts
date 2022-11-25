import { ContentGroup } from '../contentGroup/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a FollowGroup
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for FollowGroup on the backend
export type ParameterizedFollowGroup<T,G> = {
  _id:Types.ObjectId;
  userId:T;
  followGroups: Array<G>;
};

export type FollowGroup = ParameterizedFollowGroup<Types.ObjectId,Types.ObjectId>;
export type PopulatedFollowGroup = ParameterizedFollowGroup<User,ContentGroup>;

// Mongoose schema definition for interfacing with a MongoDB table
// FollowGroups stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowGroupSchema = new Schema<FollowGroup>({
  // The user id of the FollowGroup model
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // A list of users that the user followGroups
  followGroups: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ContentGroup'
  }],

});

const FollowGroupModel = model<FollowGroup>('FollowGroup', FollowGroupSchema);
export default FollowGroupModel;