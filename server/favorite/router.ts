import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FavoriteCollection from './collection';
import * as userValidator from '../user/middleware';
import * as favoriteValidator from './middleware';
import * as util from './util';
import FeedCollection from '../feed/collection';

const router = express.Router();

/**
 * Get a the usernames that a user is favoriteing and favoriteed by
 *
 * @name GET /api/favorite?username=username
 *
 * @return {FavoriteResponse} - an object containing the usernames that a user is favoriteing and favoriteed by
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  userValidator.isUsernameExistsQuery,
  async (req: Request, res: Response) => {
    const favoriteObject = await FavoriteCollection.findOneByUsername(req.query.username as string);
    const response = util.constructFavoriteResponse(favoriteObject);
    res.status(200).json(response);
  }
);

/**
 * One user favorites another user
 *
 * @name POST /api/favorite
 *
 * @param {string} username - The username of the account that the user is favoriteing
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 * @throws {405} - If you already favorite the user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExistsBody,
    favoriteValidator.isNotFavoriting,
  ],
  async (req: Request, res: Response) => {
    await FavoriteCollection.addFavoriteByUsername(req.body.username,req.session.userId);
    await FeedCollection.addOneAccount(req.session.userId,"favorites",req.body.username as string);
    res.status(201).json({
      message: `you are now favoriting ${req.body.username}`
    });
  }
);

/**
 * unfavorites another user
 *
 * @name DELETE /api/favorite/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 * @throws {405} - If you already do not favorite the user
 */
router.delete(
  '/:username',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExistsParams,
    favoriteValidator.isFavoriting,
  ],
  async (req: Request, res: Response) => {
    await FavoriteCollection.deleteFavoriteByUsername(req.params.username,req.session.userId);
    await FeedCollection.deleteOneAccount(req.session.userId,"favorites",req.params.username as string);
    res.status(200).json({
      message: `you are no longer favoriting ${req.params.username}`
    });
  }
);

export {router as favoriteRouter};