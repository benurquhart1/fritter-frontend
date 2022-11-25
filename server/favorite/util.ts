import type {HydratedDocument} from 'mongoose';
import type {Favorite, PopulatedFavorite} from '../favorite/model';

// Update this if you add a property to the Freet type!
type FavoriteResponse = {
  _id: string;
  username: string;
  favorites: Array<string>;
};

/**
 * Transform a raw favorite object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<favorite>} favorite - A favorite object
 * @returns {FavoriteResponse} - The favorite object formatted for the frontend
 */
const constructFavoriteResponse = (favorite: HydratedDocument<Favorite>): FavoriteResponse => {
  const favoriteCopy: PopulatedFavorite = {
    ...favorite.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const username:string = favoriteCopy.userId.username;
  const favorites:Array<string> = favoriteCopy.favorites.map(user => user.username);
  return {
    _id:favoriteCopy._id.toString(),
    username:username,
    favorites:favorites
  };
};

export {
  constructFavoriteResponse
};