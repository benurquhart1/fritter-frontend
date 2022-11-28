import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as feedValidator from '../feed/middleware';
import * as util from './util';
import FeedModel from './model';

const router = express.Router();

/**
 * Get a user's feed object for a feed with name = name
 *
 * @name GET /api/feed?name=name
 * @return {FeedResponse} - A response object for a feed
 * @throws {403} - If the user is not logged in
 * @throws {404} - a feed with cannot be found in the users feeds with that name
 */

router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNameExistsQuery,
  ],
  async (req: Request, res: Response) => {
    const feedObject = await FeedCollection.findOne(req.session.userId as string, req.query.name as string);
    const response = await util.constructFeedResponse(feedObject);
    res.status(200).json(response);
  }
);

/**
 * create a feed object
 *
 * @name POST /api/feed
 *
 * @param {string} name - The content of the feed
 * @return {FeedResponse} - The created feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - the name for the feed is not given
 * @throws {409} - The user already has a feed with the given name
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    // feedValidator.isNamePresentBody,
    feedValidator.isNotNameExists,
    feedValidator.isNameExistsBody,
  ],
  async (req: Request, res: Response) => {
    const feedObject = await FeedCollection.addOne(req.query.userId as string, req.body.name as string);
    const response = await util.constructFeedResponse(feedObject);
    res.status(200).json(response);
  }
);

/**
 * Delete a feed from a user
 *
 * @name DELETE /api/feed/:name
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - the name for the feed is not given
 * @throws {404} - The user does not have a feed with the given name
 */
router.delete(
  '/:name?',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNameExists,
  ],
  async (req: Request, res: Response) => {
    await FeedCollection.deleteOne(req.session.userId as string, req.params.name as string);
    res.status(200).json({
      message: 'Your feed was deleted successfully.'
    });
  }
);

/**
 * adds or removes an account/accounts from a feed object
 *
 * @name PUT /api/feed/
 * 
 * @param {string} name - The content of the feed
 * @param {Array<string>} addAccounts - the accounts to add to the feed
 * @param {Array<string>} removeAccounts - the accounts to delete from the feed
 * @param {number} sort - the sort of the account
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 * @throws {400} - the name for the feed is not given
 * @throws {404} - a feed with the given name cannot be found
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNameExistsBody,
  ],
  async (req: Request, res: Response) => {
    const addAccounts = req.body.addAccounts ? JSON.parse(req.body.addAccounts) as Array<string> : [];
    const removeAccounts = req.body.removeAccounts ? JSON.parse(req.body.removeAccounts) as Array<string> : [];
    const userId = req.session.userId as string;
    const name = req.body.name as string;
    for (const account of addAccounts) {
      await FeedCollection.addOneAccount(userId, name, account)
    }
    for (const account of removeAccounts) {
      await FeedCollection.deleteOneAccount(userId, name, account)
    }
    if (req.body.sort) {
      await FeedCollection.setSort(userId,name, req.body.sort);
    }
    const feed = await FeedCollection.findOne(userId,name);
    const feedResponse = await util.constructFeedResponse(feed)
    res.status(200).json({
      message: 'Your feed has been updated',
      feed: feedResponse,
    });
  }
);

export {router as feedRouter};
