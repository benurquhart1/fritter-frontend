import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {ContentGroup} from './model';
import UserCollection from '../user/collection';

type ContentGroupResponse = {
  _id: string;
  name: string;
  description:string;
  followers: string[];
  moderators: string[];
  accounts: string[];
  owner:string;
};

/**
 * Transform a raw ContentGroup object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<User>} group - the content group
 * @returns {ContentGroupResponse} - the response for the content group to be sent to frontend
 */
const constructContentGroupResponse = async (group: HydratedDocument<ContentGroup>): Promise<ContentGroupResponse> => {
  const contentGroupCopy: ContentGroup = {
    ...group.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const followers = await Promise.all(contentGroupCopy.followers.map(async follower => (await UserCollection.findOneByUserId(follower)).username));
  const moderators = await Promise.all(contentGroupCopy.moderators.map(async moderator => (await UserCollection.findOneByUserId(moderator)).username));
  const accounts = await Promise.all(contentGroupCopy.accounts.map(async account => (await UserCollection.findOneByUserId(account)).username));
  const owner = (await UserCollection.findOneByUserId(contentGroupCopy.owner)).username

  return {
    _id: contentGroupCopy._id.toString(),
    name: contentGroupCopy.name,
    description:contentGroupCopy.description,
    followers: followers,
    moderators: moderators,
    accounts:accounts,
    owner:owner,
  };
};

export {
  constructContentGroupResponse
};
