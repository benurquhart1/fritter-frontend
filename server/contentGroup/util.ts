import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {ContentGroup} from './model';

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
const constructContentGroupResponse = (group: HydratedDocument<ContentGroup>): ContentGroupResponse => {
  const contentGroupCopy: ContentGroup = {
    ...group.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const followers = contentGroupCopy.followers.map(follower => follower.toString());
  const moderators = contentGroupCopy.moderators.map(mod => mod.toString());
  const accounts = contentGroupCopy.accounts.map(account => account.toString());

  return {
    _id: contentGroupCopy._id.toString(),
    name: contentGroupCopy.name,
    description:contentGroupCopy.description,
    followers: followers,
    moderators: moderators,
    accounts:accounts,
    owner:contentGroupCopy.owner.toString(),
  };
};

export {
  constructContentGroupResponse
};
