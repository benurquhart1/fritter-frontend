import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Favorite
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Favorite on the backend
export type ParameterizedFavorite<T> = {
  _id:Types.ObjectId;
  userId:T;
  favorites: Array<T>;
};

export type Favorite = ParameterizedFavorite<Types.ObjectId>;
export type PopulatedFavorite = ParameterizedFavorite<User>;

// Mongoose schema definition for interfacing with a MongoDB table
// Favorites stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FavoriteSchema = new Schema<Favorite>({
  // The user id of the Favorite model
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // A list of users that the user favorites
  favorites: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],

});

const FavoriteModel = model<Favorite>('Favorite', FavoriteSchema);
export default FavoriteModel;