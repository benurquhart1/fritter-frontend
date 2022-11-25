import {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import FollowGroupModel, { FollowGroup } from './model';
import UserModel from '../user/model';
import UserCollection from '../user/collection';
import ContentGroupCollection from '../contentGroup/collection';

/**
 * This files contains a class that has the functionality to explore followGroups
 * stored in MongoDB, including adding, finding, updating, and deleting followGroups.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<FollowGroup> is the output of the FollowGroupModel() constructor,
 * and contains all the information in FollowGroup. https://mongoosejs.com/docs/typescript.html
 */
class FollowGroupCollection {
  /**
   * Set up a followGroup object for user with a given userId
   *
   * @param {Types.ObjectId} userId - the id of the user
   * @return {Promise<HydratedDocument<FollowGroup>>} - the followGroup object
   */
  static async addOne(userId: Types.ObjectId): Promise<void> {
    const followGroup = new FollowGroupModel({
      userId:userId,
      followGroups:[]
    });
    await followGroup.save();
  }

  /**
   * adds a followGroup
   *
   * @param {string} followGroupId - the id of the user that is followGroups the other
   * @param {string} followGrouprId - The id of the user that is being FollowGrouped
   */
  static async addFollowGroupById(followGroupId: Types.ObjectId | string, followGrouprId: Types.ObjectId | string): Promise<void> {
    await FollowGroupModel.updateOne({userId:followGrouprId},{$addToSet: {followGroups:followGroupId}});
  }

  /**
   * deletes a FollowGroup
   *
   * @param {string} unfollowGroupId - the id of the user that is unfollowGroups the other
   * @param {string} followGrouprId - The id of the user that is being FollowGrouped
   */
  static async deleteFollowGroupById(unfollowGroupId: Types.ObjectId | string, followGrouprId: Types.ObjectId | string): Promise<void> {
    await FollowGroupModel.updateOne({userId:followGrouprId},{$pull: {followGroups:unfollowGroupId}});
  }

  /**
   * adds a FollowGroup
   *
   * @param {Types.ObjectId | string} userId - the Id of the user
   * @param {string} groupName - the name of the group being followed
   */
  static async addFollowGroupByName(userId: Types.ObjectId | string, groupName: string): Promise<void> {
    const groupId = (await ContentGroupCollection.findOne(groupName))._id
    await FollowGroupModel.updateOne({userId:userId},{$addToSet: {followGroups:groupId}});
  }

  /**
   * removes a FollowGroup 
   *
   * @param {Types.ObjectId | string} userId - the Id of the user
   * @param {string} groupName - the name of the group being followed
   */
   static async removeFollowGroupByName(userId: Types.ObjectId | string, groupName: string): Promise<void> {
    const groupId = (await ContentGroupCollection.findOne(groupName))._id
    await FollowGroupModel.updateOne({userId:userId},{$pull: {followGroups:groupId}});
  }

  /**
   * adds one user as a FollowGrouper of another
   *
   * @param {string} userId - the id of the user that is followGroups the other
   */
  static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<FollowGroup>> {
    return FollowGroupModel.findOne({userId:userId}).populate('userId').populate('followGroups');
  }  

  /**
   * adds one user as a FollowGrouper of another
   *
   * @param {string} username - the username of the one that you are finding the followGroup model for
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<FollowGroup>> {
    const userId = (await UserCollection.findOneByUsername(username))._id;
    return FollowGroupModel.findOne({userId:userId}).populate('userId').populate('followGroups');
  }

  /**
   * determine if a user is followGroups another user
   *
   * @param {string} followGroupId - the id of the account that is checked if followGrouped
   * @param {string} followGrouprId - The id of the user that is being followGrouped
   */
  static async checkFollowingById(userId: Types.ObjectId | string, followGroupId: Types.ObjectId | string): Promise<Boolean> {
    const following = await FollowGroupModel.findOne({userId: new Types.ObjectId(userId), followGroups:followGroupId}).exec();
    return following !== null;
  }  

  // /**
  //  * deletes a FollowGroup 
  //  *
  //  * @param {string} followingUsername - the username of the user that is unfollowing the other
  //  * @param {string} followGrouprId - The id of the user that is being followGrouped
  //  */
  // static async checkFollowingByUsername(followingUsername:string, followGroupId: Types.ObjectId | string): Promise<Boolean> {
  //   const followGroupId = (await UserCollection.findOneByUsername(followingUsername))._id;
  //   return this.checkFollowingById(followGroupId,followGroupId);
  // }

  /**
     * delete a followGroup object for a user with a given id
     *
     * @param {Types.ObjectId} userId - the id of the user
     */
  static async deleteOne(userId: Types.ObjectId | string): Promise<void> {
    const followGroup = await FollowGroupModel.findOne({userId:userId});
    // const followGroups = followGroup.followGroups;
    // for (const followGroup of followGroups) {
    //   this.deleteFollowGroupById(userId,followGroup);
    // }
    followGroup.delete()
  }

}

export default FollowGroupCollection;
