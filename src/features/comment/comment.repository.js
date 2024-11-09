import ApplicationError from "../../middleware/applicationError.js";
import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { ObjectId } from "mongodb";
import { postSchema } from "../post/post.schema.js";
const PostModel = mongoose.model('Post', postSchema)
const CommentModel = mongoose.model('Comment', commentSchema)
export default class CommentRepository {

    async getByPostId(postId) {
        try {
            if (!mongoose.isValidObjectId(postId)) {
                console.error(`Invalid Post ID provided: ${postId}`);
                throw new ApplicationError('Invalid Post ID', 400);
            }
            // Find all comments for the given post ID and select only the content field
            const comments = await CommentModel.find({ postId: postId }).select('content');
            if (comments.length === 0) {
                // throw new ApplicationError('No comments found for this post', 404);
                return false;
            }
            // Extract the content from each comment
            const contentArray = comments.map(comment => comment.content);
            return contentArray;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while fetching comments by post ID', 400);
        }
    }

    async add(userId, postId, content) {
        try {
            let newComment = new CommentModel({ userId, postId, content });
            let savedComment = await newComment.save();
            await PostModel.findByIdAndUpdate(postId, { $push: { comments: content } }, { new: true })
            return savedComment;
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching  post by id', 400)
        }
    }


    async delete(id, userId) {
        try {
            // Validate the ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ApplicationError('Invalid comment ID format', 400);
            }

            // Find the comment by ID
            const comment = await CommentModel.findById(id);
            if (comment) {
                // Check if the user is authorized to delete the comment
                if (comment.userId.toString() === userId) {
                    // Remove the comment from the database
                    let postId = comment.postId;
                    let content = comment.content;
                    await CommentModel.findByIdAndDelete(id);
                    await PostModel.findByIdAndUpdate(postId, { $pull: { comments: content } }, { new: true })
                    return;
                } else {
                    throw new ApplicationError('You cannot delete this comment', 403);
                }
            } else {
                throw new ApplicationError('Comment not found', 404);
            }
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while deleting comment by id', 400);
        }
    }

    async updateComment(id, userId, content) {
        try {
            // Validate the ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ApplicationError('Invalid comment ID format', 400);
            }

            // Find the comment by ID
            let comment = await CommentModel.findById(id);
            if (comment) {
                // Check if the user is authorized to update the comment
                if (comment.userId.toString() === userId) {
                    // Update the comment
                    let postId = comment.postId;
                    let oldContent = comment.content;
                    // await PostModel.findByIdAndUpdate(postId, { $pull: { comments: oldContent } }, { new: true })

                    const updatedComment = await CommentModel.findByIdAndUpdate(
                        id,
                        { content },
                        { new: true }
                    );
                    await PostModel.findByIdAndUpdate(postId, {$pull: { comments: oldContent }, $push: { comments: content } }, { new: true })

                    return updatedComment;
                } else {
                    throw new ApplicationError('You cannot update this comment', 403);
                }
            } else {
                throw new ApplicationError('Comment not found', 404);
            }
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while updating comment by id', 400);
        }
    }






}