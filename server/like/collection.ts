import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a like object between a user and a freet
   *
   * @param {Types.ObjectId | string} freet - the freet the user is liking
   * @param {Types.ObjectId | string} user - the user who issued the like
   * @return {Promise<HydratedDocument<Like>>} - The newly created freet
   */
  static async addOne(freet: Types.ObjectId | string, user: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      freet:freet,
      user:user
    });
    await like.save(); // Saves freet to MongoDB
    return like.populate('user');
  }

  /**
   * Delete a like object
   *
   * @param {Types.ObjectId | string} freet - the freet the user is liking
   * @param {Types.ObjectId | string} user - the user who issued the like
   */
  static async deleteOne(freet: Types.ObjectId | string, user: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteOne({freet:freet,user:user})
  }

  /**
   * finds the usernames of all users who have liked a freet
   *
   * @param {Types.ObjectId | string} freet - the freet the user is liking
   * @returns {Promise<string>[]}
   */
  static async findAllLikesUsername(freet: Types.ObjectId | string): Promise<string[]> {
    const likes = Promise.all((await LikeModel.find({freet:freet})).map(async like => (await UserCollection.findOneByUserId(like.user)).username));
    return likes;
  }

  /**
   * finds the number of likes for a given freet
   *
   * @param {Types.ObjectId | string} freet - the freet the user is liking
   * @returns {Promise<Number>}
   */
   static async findNumLikes(freet: Types.ObjectId | string): Promise<Number> {
    const numLikes = LikeModel.count({freet:freet})
    return numLikes;
  }


  /**
   * Delete a like object
   *
   * @param {Types.ObjectId | string} freet - the freet the user is liking
   * @param {Types.ObjectId | string} user - the user who issued the like
   * @returns {Promise<Boolean>} whether or not the user has liked the account
   */
  static async hasLiked(freet: Types.ObjectId | string, user: Types.ObjectId | string): Promise<Boolean> {
    const like = await LikeModel.findOne({freet:freet,user:user}).exec();
    return like !== null;
  }


}

export default LikeCollection;
