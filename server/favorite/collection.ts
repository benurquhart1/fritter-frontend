import {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import FavoriteModel, { Favorite } from './model';
import UserModel from '../user/model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore favorites
 * stored in MongoDB, including adding, finding, updating, and deleting favorites.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Favorite> is the output of the FavoriteModel() constructor,
 * and contains all the information in Favorite. https://mongoosejs.com/docs/typescript.html
 */
class FavoriteCollection {
  /**
   * Set up a favorite object for user with a given userId
   *
   * @param {Types.ObjectId} userId - the id of the user
   * @return {Promise<HydratedDocument<Favorite>>} - the favorite object
   */
  static async addOne(userId: Types.ObjectId): Promise<void> {
    const favorite = new FavoriteModel({
      userId:userId,
      favorites:[]
    });
    await favorite.save();
  }

  /**
   * adds a favorite
   *
   * @param {string} favoriteId - the id of the user that is favorites the other
   * @param {string} favoriterId - The id of the user that is being Favoriteed
   */
  static async addFavoriteById(favoriteId: Types.ObjectId | string, favoriterId: Types.ObjectId | string): Promise<void> {
    await FavoriteModel.updateOne({userId:favoriterId},{$addToSet: {favorites:favoriteId}});
  }

  /**
   * deletes a Favorite
   *
   * @param {string} unfavoriteId - the id of the user that is unfavorites the other
   * @param {string} favoriterId - The id of the user that is being Favoriteed
   */
  static async deleteFavoriteById(unfavoriteId: Types.ObjectId | string, favoriterId: Types.ObjectId | string): Promise<void> {
    await FavoriteModel.updateOne({userId:favoriterId},{$pull: {favorites:unfavoriteId}});
  }

  /**
   * adds a Favorite
   *
   * @param {string} favoritingUsername - the username of the user that is favorites the other
   * @param {string} favoriterId - The id of the user that is being Favoriteed
   */
  static async addFavoriteByUsername(favoritingUsername: string, favoriterId: Types.ObjectId | string): Promise<void> {
    const favoriteId = (await UserCollection.findOneByUsername(favoritingUsername))._id
    await FavoriteModel.updateOne({userId:favoriterId},{$addToSet: {favorites:favoriteId}});
  }

  /**
   * deletes a Favorite 
   *
   * @param {string} unfavoritingUsername - the username of the user that is unfavorites the other
   * @param {string} favoriterId - The id of the user that is being favoriteed
   */
  static async deleteFavoriteByUsername(unfavoritingUsername:string, favoriterId: Types.ObjectId | string): Promise<void> {
    const unfavoriteId = (await UserCollection.findOneByUsername(unfavoritingUsername))._id;
    await FavoriteModel.updateOne({userId:favoriterId},{$pull: {favorites:unfavoriteId}});
  }

  /**
   * adds one user as a Favoriteer of another
   *
   * @param {string} userId - the id of the user that is favorites the other
   */
  static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<Favorite>> {
    return FavoriteModel.findOne({userId:userId}).populate('userId').populate('favorites');
  }  

  /**
   * adds one user as a Favoriteer of another
   *
   * @param {string} username - the username of the one that you are finding the favorite model for
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<Favorite>> {
    const userId = (await UserCollection.findOneByUsername(username))._id;
    return FavoriteModel.findOne({userId:userId}).populate('userId').populate('favorites');
  }

  /**
   * determine if a user is favorites another user
   *
   * @param {string} favoriteId - the id of the account that is checked if favoriteed
   * @param {string} favoriterId - The id of the user that is being favoriteed
   */
  static async checkFavoritingById(favoriteId: Types.ObjectId | string, favoriterId: Types.ObjectId | string): Promise<Boolean> {
    const favoriting = await FavoriteModel.findOne({userId: new Types.ObjectId(favoriterId), favorites:favoriteId}).exec();
    return favoriting !== null;
  }  

  /**
   * deletes a Favorite 
   *
   * @param {string} favoritingUsername - the username of the user that is unfavoriting the other
   * @param {string} favoriterId - The id of the user that is being favoriteed
   */
  static async checkFavoritingByUsername(favoritingUsername:string, favoriterId: Types.ObjectId | string): Promise<Boolean> {
    const favoriteId = (await UserCollection.findOneByUsername(favoritingUsername))._id;
    return this.checkFavoritingById(favoriteId,favoriterId);
  }

  /**
     * delete a favorite object for a user with a given id
     *
     * @param {Types.ObjectId} userId - the id of the user
     */
  static async deleteOne(userId: Types.ObjectId | string): Promise<void> {
    const favorite = await FavoriteModel.findOne({userId:userId});
    const favorites = favorite.favorites;
    for (const favorite of favorites) {
      this.deleteFavoriteById(userId,favorite);
    }
    favorite.delete()
  }

}

export default FavoriteCollection;
