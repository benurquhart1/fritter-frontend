import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ContentGroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as contentGroupValidator from './middleware';
import * as util from './util';
import FeedCollection from '../feed/collection';
import ContentGroupModel from './model';
import UserCollection from '../user/collection';
import FollowGroupCollection from '../followGroup/collection';

const router = express.Router();

/**
 * Get a the usernames that a user is following and followed by
 *
 * @name GET /api/follow?username=username
 *
 * @return {ContentGroupResponse} - an object containing the usernames that a user is following and followed by
 * @throws {400} - If the content group name is not given
 * @throws {404} - If the content group with that name does not exist
 *
 */
router.get(
  '/',
  [
    contentGroupValidator.isNameExistsQuery,
  ],
  async (req: Request, res: Response) => {
    const contentGroup = await ContentGroupCollection.findOne(req.query.name as string);
    const response = util.constructContentGroupResponse(contentGroup);
    res.status(200).json(response);
  }
);

/**
 * Creates a content group
 *
 * @name POST /api/contentGroup
 *
 * @param {string} name - The name of the content group
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If content group name is not given
 * @throws {409} - If the content group name is already in use
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    // contentGroupValidator.isNameExistsBody,
    contentGroupValidator.isNameNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const group = await ContentGroupCollection.addOne(req.body.name as string,req.session.userId as string,"");
    await FollowGroupCollection.addFollowGroupByName(req.session.userId,req.body.name);
    await FeedCollection.addOne(req.session.userId,req.body.name as string);
    await ContentGroupCollection.addFollowerById(req.body.name as string ,req.session.userId as string);
    res.status(201).json({
      message: `you have successfully created the content group ${req.body.name as string}`,
      contentFroup: util.constructContentGroupResponse(group)
    });
  }
);


/**
 * Modify a content group
 *
 * @name PUT /api/contentGroup/:name
 *
 * @param {string} addModerator - a moderator to be added
 * @param {string} removeModerator - a moderator to be removed
 * @param {string} addAccount - a account to be added
 * @param {string} addAccount - a account to be removed
 * @return {ContentGroupResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {400} - If the content group name is not given
 * @throws {404} - If the content group with that name does not exist
 * @throws {403} - If the user makin the request is not a moderator for the content group 
 * @throws {404} - If any of the accounts or moderators to add or remove are given, but the usernames do not exist
 */
router.put(
  '/:name?',
  [
    userValidator.isUserLoggedIn,
    contentGroupValidator.isNameExistsParams,
    contentGroupValidator.isModerator,
    contentGroupValidator.isAccountExistsAdd,
    contentGroupValidator.isAccountExistsRemove,
    contentGroupValidator.isModeratorExistsAdd,
    contentGroupValidator.isModeratorExistsRemove,
  ],
  async (req: Request, res: Response) => {
    const group = await ContentGroupCollection.updateOne(req.params.name, req.body);
    res.status(200).json({
      message: 'Your content group was updated successfully.',
      user: util.constructContentGroupResponse(group)
    });
  }
);


/**
 * Delete a content group
 *
 * @name DELETE /api/contentGroup/:name
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the content group name is not given
 * @throws {404} - If the content group with that name does not exist
 * @throws {403} - If the user is not the owner of the content group

 */
router.delete(
  '/:name',
  [
    userValidator.isUserLoggedIn,
    contentGroupValidator.isNameExistsParams,
    contentGroupValidator.isOwner
  ],
  async (req: Request, res: Response) => {
    const group = await ContentGroupModel.findOne({name:req.params.name});
    // for (const follower in group.followers) {
    //   const followerId = (await UserCollection.findOneByUsername(follower))._id
    //   await FeedCollection.deleteOne(follower,req.params.name as string);
    //   // await FollowGroupCollection.removeOne()
    // }
    for (const follower in group.followers) {
      await FollowGroupCollection.removeFollowGroupByName(follower,req.params.name);
      await FeedCollection.deleteOne(follower,req.params.name as string);
    }
    await ContentGroupCollection.deleteOne(req.params.name);
    res.status(200).json({
      message: `you have deleted the content group ${req.params.name}`
    });
  }
);

export {router as contentGroupRouter};