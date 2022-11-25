import ContentGroupCollection from '../contentGroup/collection';
import ContentGroupModel from '../contentGroup/model';
import type {HydratedDocument} from 'mongoose';
import type {FollowGroup, PopulatedFollowGroup} from '../followGroup/model';

// Update this if you add a property to the Freet type!
type FollowGroupResponse = {
  username: string;
  followGroupNames: Array<string>;
  followGroupIds: Array<string>;
};

/**
 * Transform a raw followGroup object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<followGroup>} followGroup - A followGroup object
 * @returns {FollowGroupResponse} - The followGroup object formatted for the frontend
 */
const constructFollowGroupResponse = (followGroup: HydratedDocument<FollowGroup>): FollowGroupResponse => {
  const followGroupCopy: PopulatedFollowGroup = {
    ...followGroup.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const username:string = followGroupCopy.userId.username;
  const followGroupNames:Array<string> = followGroupCopy.followGroups.map(group => group.name);
  const followGroupIds:Array<string> = followGroupCopy.followGroups.map(group => group._id.toString());
  return {
    username:username,
    followGroupNames:followGroupNames,
    followGroupIds:followGroupIds,
  };
};

export {
  constructFollowGroupResponse
};