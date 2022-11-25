import type {Request, Response, NextFunction} from 'express';
import FavoriteCollection from '../favorite/collection';

/**
 * Checks if a user favorites the user with req.params.username
 */
const isFavoriting = async (req: Request, res: Response, next: NextFunction) => {
  const favoriting = await FavoriteCollection.checkFavoritingByUsername(req.params.username,req.session.userId);
  if (!favoriting) {
    res.status(409).json({
      error: {
        favoriteNotFound: `You do not have ${req.params.username} as a favorite`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a user is not favoriting the user with req.body.username
 */
const isNotFavoriting = async (req: Request, res: Response, next: NextFunction) => {
  const favoriting = await FavoriteCollection.checkFavoritingByUsername(req.body.username,req.session.userId);
  if (favoriting) {
    res.status(409).json({
      error: {
        favoriteFound: `You already have ${req.body.username} as a favorite`
      }
    });
    return;
  }
  next();
};

export {
  isFavoriting,
  isNotFavoriting
};