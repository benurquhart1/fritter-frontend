import type {Request, Response, NextFunction} from 'express';
import FollowCollection from '../follow/collection';

/**
 * Checks if a user follows the user with req.params.username
 */
const isFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const following = await FollowCollection.checkFololowingByUsername(req.params.username,req.session.userId);
  if (!following) {
    res.status(409).json({
      error: `You do not follow ${req.params.username}`
    });
    return;
  }
  next();
};

/**
 * Checks if a user is not following the user with req.body.username
 */
const isNotFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const following = await FollowCollection.checkFololowingByUsername(req.body.username,req.session.userId);
  if (following) {
    res.status(409).json({
      error: `You are already following ${req.body.username}`
    });
    return;
  }
  next();
};

export {
  isFollowing,
  isNotFollowing
};