import type {HydratedDocument} from 'mongoose';
import type {Friend, PopulatedFriend} from '../Friend/model';

// Update this if you add a property to the Freet type!
type FriendResponse = {
  username: string;
  friends: Array<string>;
  friendMe: Array<string>;
};

/**
 * Transform a raw Friend object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Friend>} Friend - A Friend object
 * @returns {FriendResponse} - The Friend object formatted for the frontend
 */
const constructFriendResponse = (Friend: HydratedDocument<Friend>): FriendResponse => {
  const FriendCopy: PopulatedFriend = {
    ...Friend.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const username:string = FriendCopy.userId.username;
  const friends:Array<string> = FriendCopy.friends.map(user => user.username);
  const friendMe:Array<string> = FriendCopy.friendMe.map(user => user.username);
  return {
    username:username,
    friends:friends,
    friendMe:friendMe
  };
};

export {
  constructFriendResponse
};