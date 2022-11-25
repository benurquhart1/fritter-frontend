import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';
import FeedCollection from '../feed/collection';

const router = express.Router();

/**
 * Get a the usernames that a user is following and followed by
 *
 * @name GET /api/follow?username=username
 *
 * @return {FollowResponse} - an object containing the usernames that a user is following and followed by
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  userValidator.isUsernameExistsQuery,
  async (req: Request, res: Response) => {
    const followObject = await FollowCollection.findOneByUsername(req.query.username as string);
    const response = util.constructFollowResponse(followObject);
    res.status(200).json(response);
  }
);

/**
 * One user follows another user
 *
 * @name POST /api/follow
 *
 * @param {string} username - The username of the account that the user is following
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 * @throws {405} - If you already follow the user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExistsBody,
    followValidator.isNotFollowing,
  ],
  async (req: Request, res: Response) => {
    await FollowCollection.addFollowByUsername(req.body.username,req.session.userId);
    await FeedCollection.addOneAccount(req.session.userId,"following",req.body.username as string);
    res.status(201).json({
      message: `you are now following ${req.body.username}`
    });
  }
);

/**
 * unfollows another user
 *
 * @name DELETE /api/follow/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 * @throws {405} - If you already do not follow the user
 */
router.delete(
  '/:username',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExistsParams,
    followValidator.isFollowing,
  ],
  async (req: Request, res: Response) => {
    await FollowCollection.deleteFollowByUsername(req.params.username,req.session.userId);
    await FeedCollection.deleteOneAccount(req.session.userId,"following",req.params.username as string);
    res.status(200).json({
      message: `you are no longer following ${req.params.username}`
    });
  }
);

export {router as followRouter};