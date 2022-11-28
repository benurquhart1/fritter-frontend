import type {Request, Response, NextFunction} from 'express';
import FeedCollection from '../feed/collection';

/**
 * Checks if a user has a feed with a given name
 */
const isNameExists = async (req: Request, res: Response, next: NextFunction) => {
  const feed = await FeedCollection.findOne(req.session.userId,req.params.name);
  if (!feed) {
    res.status(404).json({
      error: `the feed with name ${req.params.name} cannot be found`
    });
    return;
  }
  next();
};

/**
 * Checks if a user has a feed with a given name
 */
 const isNameExistsBody = async (req: Request, res: Response, next: NextFunction) => {
  const feed = await FeedCollection.findOne(req.session.userId,req.body.name);
  if (!feed) {
    res.status(404).json({
      error: `the feed with name ${req.body.name} cannot be found`
    });
    return;
  }
  next();
};

/**
 * Checks if a user has a feed with a given name
 */
const isNameExistsQuery = async (req: Request, res: Response, next: NextFunction) => {
  const feed = await FeedCollection.findOne(req.session.userId,req.query.name as string);
  if (!feed) {
    res.status(404).json({
      error: `the feed with name ${req.query.name as string} cannot be found`
    });
    return;
  }
  next();
};

/**
 * Checks if a user does not have a feed with a given name
 */
const isNotNameExists = async (req: Request, res: Response, next: NextFunction) => {
  const feed = await FeedCollection.findOne(req.session.userId,req.body.name);
  if (feed) {
    res.status(409).json({
      error: `the feed with name ${req.body.name} already exists`
    });
    return;
  }
  next();
};

// /**
//  * Checks if a name is present in the parameters
//  */
// const isNamePresentBody = async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.body.name) {
//     res.status(400).json({
//       error: 'Provided name must be nonempty.'
//     });
//     return;
//   }
//   next();
// };

export {
  isNameExists,
  isNameExistsQuery,
  isNotNameExists,
  // isNamePresentBody,
  isNameExistsBody,
};