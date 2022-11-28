import type {Request, Response, NextFunction} from 'express';
import FriendCollection from '../friend/collection';

/**
 * Checks if a user friends the user with req.params.username
 */
const isFriending = async (req: Request, res: Response, next: NextFunction) => {
  const friending = await FriendCollection.checkFriendByUsername(req.params.username,req.session.userId);
  if (!friending) {
    res.status(409).json({
      error:`You do not have ${req.params.username} as a friend`
    });
    return;
  }
  next();
};

/**
 * Checks if a user is not friending the user with req.body.username
 */
const isNotFriending = async (req: Request, res: Response, next: NextFunction) => {
  const friending = await FriendCollection.checkFriendByUsername(req.body.username,req.session.userId);
  if (friending) {
    res.status(409).json({
      error: `You already have ${req.body.username} as a friend`
    });
    return;
  }
  next();
};

export {
  isFriending,
  isNotFriending
};