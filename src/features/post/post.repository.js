import ApplicationError from "../../middleware/applicationError.js";
import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { ObjectId } from "mongodb";
const PostModel = mongoose.model('Post', postSchema)
export default class PostRepository {
    async get() {
        try {
            const allPost = await PostModel.find();
            return allPost;
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching all posts', 400)
        }
    }

    async getByPostId(id) {

        try {
            // Check if the ID is a valid ObjectId before attempting to convert it
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error(`Invalid Post ID provided: ${id}`);
                throw new ApplicationError('Invalid Post ID', 400);
            }

            // Convert the string id to ObjectId
            const objectId = new mongoose.Types.ObjectId(id);

            const post = await PostModel.findById(objectId);
            if (!post) {
                throw new ApplicationError('Post not found', 404);
            }
            return post;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while fetching post by ID', 400);
        }

    }

    async getByUserId(userId) {
        try {
            const userPosts = await PostModel.find({ userId: userId });
            return userPosts; // / Find and return post by ID
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching post by id', 400)
        }

    }

    async add(userId, caption, imageUrl) {

        try {
            const newPost = new PostModel({ userId, caption, imageUrl });
            const savedPost = await newPost.save() // Add new post to the posts array
            return savedPost;
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching post by id', 400)
        }
    }

    async delete(id, userId) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ApplicationError('Invalid post ID format', 400);
            }
            const post = await PostModel.findById(id);
            if (!post) {
                throw new ApplicationError('Post not found', 404);
            }

            // Check if the user trying to delete the post is the owner of the post
            if (post.userId.toString() !== userId.toString()) {
                throw new ApplicationError('Unauthorized: You cannot delete this post', 403);
            }

            // Delete the post if the user is authorized
            await PostModel.findByIdAndDelete(id);

            return;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error; // If the error is a custom application error, rethrow it
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while deleting post by id', 400)
        }

    }

    async updatePost(id, userId, caption, imageUrl) {

        try {

            // Find the post by ID
            const post = await PostModel.findById(id);
            if (!post) {
                throw new ApplicationError('Post not found', 404);
            }

            // Check if the user is the owner of the post
            if (post.userId.toString() !== userId.toString()) {
                throw new ApplicationError('Unauthorized: You cannot update this post', 403);
            }

            // Update the post if the user is the owner
            const updatedPost = await PostModel.findByIdAndUpdate(
                id,
                { caption, imageUrl },
                { new: true }
            );

            return updatedPost;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error; // If the error is a custom application error, rethrow it
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while updating post by id', 400);
        }

    }
}