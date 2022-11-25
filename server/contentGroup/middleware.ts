import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import ContentGroupCollection from './collection';
import ContentGroupModel from './model';


/**
 * Checks if a username in req.body is already in use
 */
const isNameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.name as string);
  const group = await ContentGroupCollection.findOne(req.body.name as string);
  if (!user && !group) {
    next();
    return;
  }
  res.status(409).json({
    error: {
      nameInUse: 'The group name is already in use'
    }
  });
};

const isUsernameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.username);

  // If the current session user wants to change their username to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!user || (user?._id.toString() === req.session.userId)) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: 'An account with this username already exists.'
    }
  });
};



/**
 * Checks if a name exists
 * helper function for other methods that are specific to the location of the username
 */
 const isNameExists = async (name: string, res: Response, next: NextFunction) => {
  if (!name) {
    res.status(400).json({
      error: 'Provided username must be nonempty.'
    });
    return;
  }
  const group = await ContentGroupCollection.findOne(name as string);
  if (!group) {
    res.status(404).json({
      error: `A group with name ${name as string} does not exist.`
    });
    return;
  }
  next();
};

/**
 * Checks if a username in req.body exists
 */
const isNameExistsBody = async (req: Request, res: Response, next: NextFunction) => {
  isNameExists((req.body.name as string) ?? '', res, next);
};

/**
 * Checks if a username in req.query exists
 */
 const isNameExistsQuery = async (req: Request, res: Response, next: NextFunction) => {
  isNameExists((req.query.name as string) ?? '', res, next);
};

/**
 * Checks if a username in req.query exists
 */
 const isNameExistsParams = async (req: Request, res: Response, next: NextFunction) => {
  isNameExists((req.params.name as string) ?? '', res, next);
};

/**
 * Checks if a user is a moderator for the group
 */
const isModerator = async (req: Request, res: Response, next: NextFunction) => {
  const result = ContentGroupCollection.isModerator(req.params.name,req.session.userId);
  if (!result) {
    res.status(403).json({
      error: {
        notModerator: `You are not a moderator for the group`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a user is a moderator for the group
 */
 const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  const result = ContentGroupCollection.isOwner(req.params.name,req.session.userId);
  if (!result) {
    res.status(403).json({
      error: {
        notOwner: `You are not the owner of the group`
      }
    });
    return;
  }
  next();
};

export {
  isNameNotAlreadyInUse,
  isNameExistsBody,
  isNameExistsParams,
  isNameExistsQuery,
  isModerator,
  isOwner,
};
