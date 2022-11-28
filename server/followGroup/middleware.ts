import ContentGroupCollection from '../contentGroup/collection';
import type {Request, Response, NextFunction} from 'express';
import FollowGroupCollection from '../followGroup/collection';

/**
 * Checks if a user follows the group with name req.params.name
 */
const isFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const groupId = (await ContentGroupCollection.findOne(req.params.name))._id
  const following = await FollowGroupCollection.checkFollowingById(req.session.userId, groupId);
  if (!following) {
    res.status(409).json({
      error: `You are not following the group ${req.params.name}`
    });
    return;
  }
  next();
};

/**
 * Checks if a user is not following the the group with req.params.name
 */
const isNotFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const groupId = (await ContentGroupCollection.findOne(req.body.name))._id
  const following = await FollowGroupCollection.checkFollowingById(req.session.userId, groupId);
  if (following) {
    res.status(409).json({
      error: `You are already following ${req.body.name}`
    });
    return;
  }
  next();
};

export {
  isFollowing,
  isNotFollowing
};