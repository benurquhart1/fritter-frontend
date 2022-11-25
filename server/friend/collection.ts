import {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import FriendModel, { Friend } from './model';
import UserModel from '../user/model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore friends
 * stored in MongoDB, including adding, finding, updating, and deleting friends.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Friend> is the output of the FriendModel() constructor,
 * and contains all the information in Friend. https://mongoosejs.com/docs/typescript.html
 */
class FriendCollection {
  /**
   * Set up a Friend object for user with s given userId
   *
   * @param {Types.ObjectId} userId - the id of the user
   * @return {Promise<HydratedDocument<Friend>>} - the Friend object
   */
  static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Friend>> {
    const Friend = new FriendModel({
      userId:userId,
      friends:[],
      friendMe:[]
    });
    await Friend.save();
    return Friend
  }

  /**
   * adds a Friend
   *
   * @param {Types.ObjectId | string} friendId - the id of the user is adding as friend
   * @param {Types.ObjectId | string} userId - The id of the user that is being added as friend
   */
  static async addFriendById(friendId: Types.ObjectId, userId: Types.ObjectId | string): Promise<void> {
    await FriendModel.updateOne({userId:userId},{$addToSet: {friends:friendId}});
    await FriendModel.updateOne({userId:friendId},{$addToSet: {friendMe:userId}});
  }

  /**
   * deletes a Friend
   *
   * @param {Types.ObjectId | string} friendId - the id of the user is unadded as friend
   * @param {Types.ObjectId | string} userId - The id of the user that is being unadded as friend
   */
   static async deleteFriendById(friendId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<void> {
    await FriendModel.updateOne({userId:userId},{$pull: {friends:friendId}});
    await FriendModel.updateOne({userId:friendId},{$pull: {friendMe:userId}});
  }

  /**
   * adds a Friend
   *
   * @param {string} FriendUsername - the username of the user that is Friending the other
   * @param {Types.ObjectId | string} userId - The id of the user that is being Friended
   */
  static async addFriendByUsername(friendUsername: string, userId: Types.ObjectId | string): Promise<void> {
    const friendId = (await UserCollection.findOneByUsername(friendUsername))._id
    await FriendModel.updateOne({userId:userId},{$addToSet: {friends:friendId}});
    await FriendModel.updateOne({userId:friendId},{$addToSet: {friendMe:userId}});
  }

  /**
   * deletes a Friend 
   *
   * @param {string} unFriendingUsername - the username of the user that is unnFriending the other
   * @param {Types.ObjectId | string} userId - The id of the user that is being Friended
   */
  static async deleteFriendByUsername(unFriendUsername:string, userId: Types.ObjectId | string): Promise<void> {
    const unFriendId = (await UserCollection.findOneByUsername(unFriendUsername))._id;
    await FriendModel.updateOne({userId:userId},{$pull: {friends:unFriendId}});
    await FriendModel.updateOne({userId:unFriendId},{$pull: {friendMe:userId}});
  }

  /**
   * adds one user as a Friender of another
   *
   * @param {Types.ObjectId | string} userId - the id of the user that is Friending the other
   */
  static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<Friend>> {
    return FriendModel.findOne({userId:userId}).populate('userId').populate('friends').populate('friendMe');
  }  

  /**
   * adds one user as a Friender of another
   *
   * @param {string} username - the username of the one that you are finding the Friend model for
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<Friend>> {
    const userId = (await UserCollection.findOneByUsername(username))._id;
    return FriendModel.findOne({userId:userId}).populate('userId').populate('friends').populate('friendMe');
  }

  /**
   * determine if a user is Friending another user
   *
   * @param {Types.ObjectId | string} friendId - the id of the account that is checked if Friended
   * @param {Types.ObjectId | string} userId - The id of the user that is being Friended
   */
  static async checkFriendById(friendId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Boolean> {
    const friending = await FriendModel.findOne({userId: new Types.ObjectId(userId), friends:friendId}).exec();
    return friending !== null;
  }  

  /**
   * determine if a user is Friending another user
   *
   * @param {Types.ObjectId | string} friendId - the id of the account that is checked if Friended
   * @param {string} username - The id of the user that is being Friended
   */
  static async checkFriendByUsername(friendUsername: string, userId: Types.ObjectId | string): Promise<Boolean> {
    const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
    return this.checkFriendById(friendId,userId);
  }  

  /**
   * determine if there is a friendship pair between users
   *
   * @param {Types.ObjectId | string} friendId - the id of the account that is checked if Friended
   * @param {Types.ObjectId | string} userId - The id of the user that is being Friended
   */
  static async checkFriendshipById(friendId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Boolean> {
    const friending = await FriendModel.findOne({userId: new Types.ObjectId(userId), friends:friendId}).exec();
    const reverseFriending = await FriendModel.findOne({userId: new Types.ObjectId(friendId), friends:userId}).exec();
    return friending !== null && reverseFriending !== null;
  }  
  /**
   * determine if there is a friendship pair between users
   *
   * @param {Types.ObjectId | string} friendId - the id of the account that is checked if Friended
   * @param {string} username - The id of the user that is being Friended
   */
  static async checkFriendshipByUsername(friendUsername: string, userId: Types.ObjectId | string): Promise<Boolean> {
    const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
    return this.checkFriendshipById(friendId,userId);
  }

  /**
     * delete a friend object for a user with a given id
     *
     * @param {Types.ObjectId} userId - the id of the user
     */
  static async deleteOne(userId: Types.ObjectId | string): Promise<void> {
    const friend = await FriendModel.findOne({userId:userId});
    const friends = friend.friends;
    const friendMe = friend.friendMe;
    for (const friend of friendMe) {
      this.deleteFriendById(friend,userId);
    }
    for (const friend of friends) {
      this.deleteFriendById(userId,friend);
    }
    friend.delete()
  }

}

export default FriendCollection;
