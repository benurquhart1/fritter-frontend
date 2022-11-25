import FreetCollection from '../freet/collection';
import { FreetResponse } from '../freet/util';
import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from 'user/collection';
import type {Feed, PopulatedFeed} from '../feed/model';
import FeedCollection from './collection';
import * as freetUtil from '../freet/util';

// Update this if you add a property to the Freet type!
type FeedResponse = {
  name:string;
  accounts: Array<string>;
  sort:Number;
  freets:Array<FreetResponse>
};

/**
 * Transform a raw Feed object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Feed>} feed - A feed object
 * @returns {FeedResponse} - The feed object formatted for the frontend
 */
const constructFeedResponse = async(feed: HydratedDocument<Feed>): Promise<FeedResponse> => {
  const feedCopy: PopulatedFeed = {
    ...feed.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const accountIds = feedCopy.accounts.map(user => user._id);
  const accounts:Array<string> = feedCopy.accounts.map(user => user.username);
  const freets = await FreetCollection.findAllByIdAndSort(accountIds,feed.sort)
  const freetResponse = await Promise.all(freets.map(async(freet) => await freetUtil.constructFreetResponse(freet)))
  const name:string = feedCopy.name;
  const sort = feedCopy.sort;
  return {
    name:name,
    accounts: accounts,
    sort:sort,
    freets:freetResponse
  };
};

export {
  constructFeedResponse
};