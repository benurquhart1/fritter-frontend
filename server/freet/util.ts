import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import { Sort } from '../feed/model';
import LikeCollection from '../like/collection';

// Update this if you add a property to the Freet type!
export type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  likes:string[]
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = async (freet: HydratedDocument<Freet>): Promise<FreetResponse> => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;
  const likes = await LikeCollection.findAllLikesUsername(freet._id)
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
    likes:likes
  };
};

const getNumLikes = async (freet: HydratedDocument<Freet>): Promise<Number> => {
  const numLikes = (await LikeCollection.findAllLikesUsername(freet._id)).length;
  return numLikes;
}
export {
  constructFreetResponse,
  getNumLikes
};
