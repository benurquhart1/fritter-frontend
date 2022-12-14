import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowGroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followGroupValidator from './middleware';
import * as util from './util';
import FeedCollection from '../feed/collection';
import ContentGroupCollection from '../contentGroup/collection';

const router = express.Router();

/**
 * Get a the groups that a user is following
 *
 * @name GET /api/followGroup?username=username
 *
 * @return {FollowGroupResponse} - an object containing the names and ids of the groups a user follows
 * @throws {400} - If name is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  [
    userValidator.isUsernameExistsQuery,
  ],
  async (req: Request, res: Response) => {
    const followGroupObject = await FollowGroupCollection.findOneByUsername(req.query.username as string);
    const response = util.constructFollowGroupResponse(followGroupObject);
    res.status(200).json(response);
  }
);

/**
 * One user follows a content group
 *
 * @name POST /api/followGroup
 *
 * @param {string} username - The username of the account that the user is followGrouping
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If group name is not given
 * @throws {404} - If no group with that name can be found
 * @throws {409} - If you already follow the group
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    // userValidator.isUsernameExistsBody,
    followGroupValidator.isNotFollowing,
  ],
  async (req: Request, res: Response) => {
    await FollowGroupCollection.addFollowGroupByName(req.session.userId,req.body.name);
    await FeedCollection.addOne(req.session.userId,req.body.name);
    await ContentGroupCollection.addFollowerById(req.body.name,req.session.userId);
    const group = await ContentGroupCollection.findOne(req.body.name);
    for (const account of group.accounts) {
      await FeedCollection.addOneAccountById(req.session.userId,req.body.name,account);
    }
    res.status(201).json({
      message: `you are now following ${req.body.name}`
    });
  }
);

/**
 * unfollow a content group
 *
 * @name DELETE /api/followGroup/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If a content group with that name cannot be found
 * @throws {405} - If you do not follow the content group
 */
router.delete(
  '/:name',
  [
    userValidator.isUserLoggedIn,
    // userValidator.isUsernameExistsParams,
    followGroupValidator.isFollowing,
  ],
  async (req: Request, res: Response) => {
    await FollowGroupCollection.removeFollowGroupByName(req.session.userId, req.params.name);
    await FeedCollection.deleteOne(req.session.userId,req.params.name);
    await ContentGroupCollection.removeFollowerById(req.body.name,req.session.userId);
    res.status(200).json({
      message: `you are no longer following ${req.params.name}`
    });
  }
);

export {router as followGroupRouter};