import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if the user has liked the freet
 */
const hasLiked = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const like = validFormat ? await LikeCollection.hasLiked(req.params.freetId,req.session.userId as string) : '';
  if (!like) {
    res.status(404).json({
      error: {
        LikeNotFound: `The user has not liked the freet`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user has not liked the freet
 */
const hasNotLiked = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const like = validFormat ? await LikeCollection.hasLiked(req.body.freetId,req.session.userId as string) : '';
  if (like) {
    res.status(404).json({
      error: {
        LikeFound: `The user has already liked the freet`
      }
    });
    return;
  }

  next();
};


export {
  hasLiked,
  hasNotLiked
};
