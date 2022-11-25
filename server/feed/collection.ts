import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import FeedModel, { Feed, Sort, PopulatedFeed} from './model';
import UserModel from '../user/model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore feeds
 * stored in MongoDB, including adding, finding, updating, and deleting feed.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Feed> is the output of the FeedModel() constructor,
 * and contains all the information in Feed. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
  /**
   * Set up a feed object for user with s given userId
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @return {Promise<HydratedDocument<Feed>} - the feed object
   */
  static async addOne(userId: Types.ObjectId | string, name:string): Promise<HydratedDocument<Feed>> {
    const feed = new FeedModel({
      name:name,
      userId:userId,
      accounts:[],
      sort:Sort.date,
    });
    await feed.save();
    return FeedModel.findOne({userId:userId,name:name}).populate("userId").populate('accounts');
  }

  /**
   * Find a feed object
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @return {Promise<HydratedDocument<Feed>} - the feed object
   */
  static async findOne(userId: Types.ObjectId | string, name:string): Promise<HydratedDocument<Feed>> {
    return FeedModel.findOne({userId:userId,name:name}).populate("userId").populate('accounts');
  }

  /**
   * Find a feed object unpopulated
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @return {Promise<HydratedDocument<Feed>} - the feed object
   */
   static async findOneUnpopulated(userId: Types.ObjectId | string, name:string): Promise<HydratedDocument<Feed>> {
    return FeedModel.findOne({userId:userId,name:name})
  }

  /**
   * deletes a feed object
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   */
  static async deleteOne(userId: Types.ObjectId | string, name:string): Promise<void> {
    await FeedModel.deleteOne({userId:userId,name:name});
  }

  /**
   * Deletes all of a user's feed objects and removes them from the sources for other feeds
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   */
  static async deleteAllByUser(userId: Types.ObjectId | string): Promise<void> {
    await FeedModel.deleteMany({userId:userId});
    await FeedModel.updateMany({userId:userId}, {$pull: {accounts:userId}});
  }

  /**
   * adds an account to the feed's accounts
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @param {string} account - the username of the account who is being added
   */
  static async addOneAccount(userId: Types.ObjectId | string, name:string, account:string): Promise<void> {
    const accountId = (await UserCollection.findOneByUsername(account))._id;
    await FeedModel.updateOne({userId:userId,name:name}, {$addToSet: {accounts:accountId}});
  }

  /**
   * adds an account to the feed's accounts
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @param {string} account - the username of the account who is being added
   */
  static async addOneAccountById(userId: Types.ObjectId | string, name:string, accountId: Types.ObjectId | string): Promise<void> {
    await FeedModel.updateOne({userId:userId,name:name}, {$addToSet: {accounts:accountId}});
  }

  /**
   * adds an account to the feed's accounts
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @param {Sort} sort - the new sort of the feed
   */
   static async setSort(userId: Types.ObjectId | string, name:string, sort:Sort): Promise<void> {
    await FeedModel.updateOne({userId:userId,name:name}, {$set: {sort:sort}});
  }

  /**
   * deletes an account to the feed's accounts
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @param {string} account - the username of the account who is being deleted from accounts
   */
  static async deleteOneAccount(userId: Types.ObjectId | string, name:string, account:string): Promise<void> {
    const accountId = (await UserCollection.findOneByUsername(account))._id;
    await FeedModel.updateOne({userId:userId,name:name}, {$pull: {accounts:accountId}});
  }

  /**
   * removes an account to the feed's accounts
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @param {string} account - the username of the account who is being added
   */
  static async deleteOneAccountById(userId: Types.ObjectId | string, name:string, accountId: Types.ObjectId | string): Promise<void> {
    await FeedModel.updateOne({userId:userId,name:name}, {$pull: {accounts:accountId}});
  }

  /**
   * checks if an account is in the feed's accounts
   *
   * @param {Types.ObjectId | string} userId - the id of the user
   * @param {string} name - the name of the feed
   * @param {string} account - the username of the account who is being deleted from accounts
   * @returns {Boolean} a boolean representing whether or not the account is in the feed
   */
  static async checkAccount(userId: Types.ObjectId | string, name:string, account:string): Promise<Boolean> {
    const accountId = (await UserCollection.findOneByUsername(account))._id;
    const feed = await FeedModel.findOne({userId:userId, name:name, accounts:accountId});
    return feed !== null;
  }
};



export default FeedCollection;
