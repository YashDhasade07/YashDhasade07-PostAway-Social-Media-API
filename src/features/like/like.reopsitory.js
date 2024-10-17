import ApplicationError from "../../middleware/applicationError.js";
import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";
const LikeModel = mongoose.model('Like', likeSchema)
export default class LikeRepository {


    // Get all likes for a specific post or comment by ID
    async getByPostId(id) {

        try {
            let likes = await LikeModel.find({ likeable: id }).populate('userId' ,'_id name email')
            return likes;
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching all likes', 400)
        }

    } 
    // Toggle the like status for a post by a user
    async toggle(userId, postId, types) {
        try {
            // Validate the ID format
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
                throw new ApplicationError('Invalid ID format', 400);
            }
  
            // Find if the like already exists
            let liked = await LikeModel.findOne({ userId: userId, likeable: postId });

            if (!liked) {
                // If like does not exist, add it (like)
                let newLike = new LikeModel({ userId, likeable: postId, types });
                await newLike.save();
                return "Like is added";
            } else {
                // If like exists, remove it (unlike)
                await LikeModel.findByIdAndDelete(liked._id);
                return "Like is removed";
            }
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error; 
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while toggling like', 400);
        }
    }

}