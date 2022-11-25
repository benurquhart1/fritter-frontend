import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../follow/model';

// Update this if you add a property to the Freet type!
type FollowResponse = {
  username: string;
  following: Array<string>;
  followers: Array<string>;
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow object
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const username:string = followCopy.userId.username;
  const following:Array<string> = followCopy.following.map(user => user.username);
  const followers:Array<string> = followCopy.followers.map(user => user.username);
  return {
    username:username,
    following:following,
    followers:followers
  };
};

export {
  constructFollowResponse
};