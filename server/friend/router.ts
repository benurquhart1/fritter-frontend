import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FriendCollection from './collection';
import * as userValidator from '../user/middleware';
import * as friendValidator from './middleware';
import * as util from './util';
import FeedCollection from '../feed/collection';

const router = express.Router();

/**
 * Get a the usernames that a user is friending and friended by
 *
 * @name GET /api/friend?username=username
 *
 * @return {FriendResponse} - an object containing the usernames that a user is Friending and Friended by
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  userValidator.isUsernameExistsQuery,
  async (req: Request, res: Response) => {
    const friendObject = await FriendCollection.findOneByUsername(req.query.username as string);
    const response = util.constructFriendResponse(friendObject);
    res.status(200).json(response);
  }
);

/**
 * One user friends another user
 *
 * @name POST /api/friend
 *
 * @param {string} username - The username of the account that the user is friending
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 * @throws {405} - If you are already friending the user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExistsBody,
    friendValidator.isNotFriending,
  ],
  async (req: Request, res: Response) => {
    await FriendCollection.addFriendByUsername(req.body.username,req.session.userId);
    await FeedCollection.addOneAccount(req.session.userId,"friends",req.body.username as string);
    res.status(201).json({
      message: `you are now friending ${req.body.username}`
    });
  }
);

/**
 * unfriends another user
 *
 * @name DELETE /api/friend/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 * @throws {405} - If you are not already friending the user
 */
router.delete(
  '/:username',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExistsParams,
    friendValidator.isFriending,
  ],
  async (req: Request, res: Response) => {
    await FriendCollection.deleteFriendByUsername(req.params.username,req.session.userId);
    await FeedCollection.deleteOneAccount(req.session.userId,"friends",req.params.username as string);
    res.status(200).json({
      message: `you are no longer friending ${req.params.username}`
    });
  }
);

export {router as friendRouter};