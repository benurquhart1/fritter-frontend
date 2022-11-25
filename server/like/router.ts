import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from '../like/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get list of account usernames that have liked a post
 *
 * @name GET /api/like
 * @return {string[]} - A list of all the usernames of the accounts that have liked the freet
 * @throws {404} - If the freetId is not valid
 */

router.get(
  '/',
  [
    freetValidator.isFreetExistsQuery,
  ],
  async (req: Request, res: Response) => {
    const likes = await LikeCollection.findAllLikesUsername(req.query.freetId as string)
    res.status(200).json(likes);
  }
);



/**
 * like a freet
 *
 * @name POST /api/like
 *
 * @param {string} freetId - the Id of the freet being liked
 * @return {string} - a success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user has already liked the freet
 * @throws {404} - If the freetId is not valid
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExistsBody,
    likeValidator.hasNotLiked
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await LikeCollection.addOne(req.body.freetId as string, userId);
    res.status(201).json({
      message: 'You have successfully liked the freet.',
    });
  }
);

/**
 * unlike a freet
 *
 * @name DELETE /api/like/:freetId
 *
 * @return {string} - a success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user has already liked the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.hasLiked
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.freetId,req.session.userId);
    res.status(200).json({
      message: 'You have unliked the freet.'
    });
  }
);

export {router as likeRouter};
