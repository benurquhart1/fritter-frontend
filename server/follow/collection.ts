import {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import FollowModel, { Follow } from './model';
import UserModel from '../user/model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB, including adding, finding, updating, and deleting follows.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Set up a follow object for user with s given userId
   *
   * @param {Types.ObjectId} userId - the id of the user
   * @return {Promise<HydratedDocument<Follow>>} - the follow object
   */
  static async addOne(userId: Types.ObjectId): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({
      userId:userId,
      followers:[],
      following:[]
    });
    await follow.save();
    return follow;
  }

  /**
   * adds a follow
   *
   * @param {string} followingId - the id of the user that is following the other
   * @param {string} followerId - The id of the user that is being followed
   */
  static async addFollowById(followingId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<void> {
    await FollowModel.updateOne({userId:followerId},{$addToSet: {following:followingId}});
    await FollowModel.updateOne({userId:followingId},{$addToSet: {followers:followerId}});
  }

  /**
   * deletes a follow
   *
   * @param {string} unfollowingId - the id of the user that is unfollowing the other
   * @param {string} followerId - The id of the user that is being followed
   */
  static async deleteFollowById(unfollowingId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<void> {
    await FollowModel.updateOne({userId:followerId},{$pull: {following:unfollowingId}});
    await FollowModel.updateOne({userId:unfollowingId},{$pull: {followers:followerId}});
  }

  /**
   * adds a follow
   *
   * @param {string} followingUsername - the username of the user that is following the other
   * @param {string} followerId - The id of the user that is being followed
   */
  static async addFollowByUsername(followingUsername: string, followerId: Types.ObjectId | string): Promise<void> {
    const followingId = (await UserCollection.findOneByUsername(followingUsername))._id
    await FollowModel.updateOne({userId:followerId},{$addToSet: {following:followingId}});
    await FollowModel.updateOne({userId:followingId},{$addToSet: {followers:followerId}});
  }

  /**
   * deletes a follow 
   *
   * @param {string} unfollowingUsername - the username of the user that is unnfollowing the other
   * @param {string} followerId - The id of the user that is being followed
   */
  static async deleteFollowByUsername(unfollowingUsername:string, followerId: Types.ObjectId | string): Promise<void> {
    const unfollowingId = (await UserCollection.findOneByUsername(unfollowingUsername))._id;
    await FollowModel.updateOne({userId:followerId},{$pull: {following:unfollowingId}});
    await FollowModel.updateOne({userId:unfollowingId},{$pull: {followers:followerId}});
  }

  /**
   * adds one user as a follower of another
   *
   * @param {string} userId - the id of the user that is following the other
   */
  static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({userId:userId}).populate('userId').populate('following').populate('followers');
  }  

  /**
   * adds one user as a follower of another
   *
   * @param {string} username - the username of the one that you are finding the Follow model for
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<Follow>> {
    const userId = (await UserCollection.findOneByUsername(username))._id;
    return FollowModel.findOne({userId:userId}).populate('userId').populate('following').populate('followers');
  }

  /**
   * determine if a user is following a
   *
   * @param {string} followingId - the id of the account that is checked if followed
   * @param {string} followerId - The id of the user that is being followed
   */
   static async checkFollowingById(followingId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<Boolean> {
    const following = await FollowModel.findOne({user: new Types.ObjectId(followerId), following:followingId}).exec();
    return following !== null;
  }  

  /**
   * deletes a follow 
   *
   * @param {string} followingUsername - the username of the user that is unnfollowing the other
   * @param {string} followerId - The id of the user that is being followed
   */
  static async checkFololowingByUsername(followingUsername:string, followerId: Types.ObjectId | string): Promise<Boolean> {
    const followingId = (await UserCollection.findOneByUsername(followingUsername))._id;
    return this.checkFollowingById(followingId,followerId);
  }

  /**
     * delete a follow object for a user with a given id
     *
     * @param {Types.ObjectId} userId - the id of the user
     */
  static async deleteOne(userId: Types.ObjectId | string): Promise<void> {
    const follow = await FollowModel.findOne({userId:userId});
    const followers = follow.followers;
    const following = follow.following;
    for (const follower of followers) {
      this.deleteFollowById(follower,userId);
    }
    for (const follow of following) {
      this.deleteFollowById(userId,follow);
    }
    follow.delete()
  }

}

export default FollowCollection;
