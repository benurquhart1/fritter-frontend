import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from '../like/model';

// Update this if you add a property to the Freet type!
export type LikeResponse = {
  posts:Types.ObjectId[]
};

// const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
//   const freetCopy: PopulatedFreet = {
//     ...freet.toObject({
//       versionKey: false // Cosmetics; prevents returning of __v property
//     })
//   };
//   const {username} = freetCopy.authorId;
//   delete freetCopy.authorId;
//   return {
//     ...freetCopy,
//     _id: freetCopy._id.toString(),
//     author: username,
//     dateCreated: formatDate(freet.dateCreated),
//     dateModified: formatDate(freet.dateModified)
//   };
// };

// export {
//   constructLikeResponse,
// };
