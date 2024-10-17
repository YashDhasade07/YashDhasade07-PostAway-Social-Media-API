import ApplicationError from "../../middleware/applicationError.js";
import mongoose from "mongoose";
import { friendshipSchema } from "./friendship.schema.js";
import { ObjectId } from "mongodb";
import { userSchema } from "../user/user.schema.js";
const FriendshipModel = mongoose.model('Friendship', friendshipSchema);
const UserModel = mongoose.model('User', userSchema);
export default class FriendshipRepository {

    async getByUserId(userId){
        try {
            // Find the user by ID and populate the 'friends' field with user details
            let user = await UserModel.findById(userId).select('friends').populate('friends', 'name email gender');
            
            // Check if the user has friends
            if (user && user.friends.length > 0) {
                return user.friends; // Return the list of friends
            } else {
                return { message: 'User has no friends' };
            }
        } catch (error) {
            console.error(error);
            throw new ApplicationError('Something went wrong while fetching the user\'s friends', 400);
        }
    }

    async getPendingRequest(userId) {
        try {
            // Fetch all pending friend requests where user2 is the receiver (userId)
            let friendRequests = await FriendshipModel.find({
                user2: userId,
                status: 'pending'
            }).populate('user1', 'name email').select('-user2'); // Populate sender details if needed
    
            // Check if there are pending requests
            if (friendRequests.length > 0) {
                return friendRequests;
            } else {
                return { message: 'No pending requests' };
            }
        } catch (error) {
            console.error(error);
            throw new ApplicationError('Something went wrong while fetching friend requests', 400);
        }
    }

    async toggleRequest(friendId, userId) {
        try {
            // Ensure the IDs are valid
            if(friendId == userId){
                return { message: 'you cant send request to yourself' };
            }
            if (!mongoose.isValidObjectId(friendId) || !mongoose.isValidObjectId(userId)) {
                console.error(`Invalid user ID or friend ID provided: ${friendId}, ${userId}`);
                throw new ApplicationError('Invalid IDs provided', 400);
            }

            // Check if a friendship is already established or in the process of being established
            let friendship = await FriendshipModel.findOne({
                $or: [
                    { user1: userId, user2: friendId },
                    { user1: friendId, user2: userId }
                ]
            });

            // If friendship exists
            if (friendship) {
                // Handle "pending" status
                if (friendship.status === 'pending') {
                    await FriendshipModel.findByIdAndDelete(friendship._id);
                    return { message: 'Friend request removed' };
                }
                // Handle "active" status
                if (friendship.status === 'active') {
                    await FriendshipModel.findByIdAndDelete(friendship._id);
                    await UserModel.updateOne({ _id: userId }, { $pull: { friends: friendId } });
                    await UserModel.updateOne({ _id: friendId }, { $pull: { friends: userId } });
                    return { message: 'Friend has been removed' };
                }
            }

            // Handle if no friendship exists
            // Check if there's a pending request from the friend
            let pendingRequest = await FriendshipModel.findOne({
                user1: friendId,
                user2: userId,
                status: 'pending'
            });

            if (pendingRequest) {
                return {
                    message: 'You have a pending friend request from this user. Please accept or reject the request.'
                };
            }

            // Otherwise, send a new friend request
            let newFriendship = new FriendshipModel({
                user1: userId,
                user2: friendId,
                status: 'pending'
            });
            await newFriendship.save();

            return { message: 'Friend request sent' };

        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error; 
            }
            console.error(error);
            throw new ApplicationError('Something went wrong while handling the friend request', 400);
        }
    }


    async respondToRequest(friendId, userId, response) {
        try {
            // Find the pending friend request from friendId to userId
            console.log(`heyyyy`);
            console.log({res : response});
            if (typeof response !== 'boolean') {
                return {
                    message: 'the response value in the body should be strictly true or false'
                }
            }
            let friendRequest = await FriendshipModel.findOne({
                user1: friendId,
                user2: userId,
                status: 'pending'
            });

            // If the user wants to accept the request
            if (response === true) {
                if (friendRequest) {
                    // Update friendship status to active
                    friendRequest.status = 'active';

                    // Add each user to the other's friend list
                    await UserModel.updateOne({ _id: userId }, { $push: { friends: friendId } });
                    await UserModel.updateOne({ _id: friendId }, { $push: { friends: userId } });

                    // Save the updated friend request
                    await friendRequest.save();

                    return {
                        message: 'Friend request accepted'
                    };
                } else {
                    return {
                        message: 'No pending request from this user'
                    };
                }
            } else { // If the user wants to reject the request
                if (friendRequest) {
                    // Delete the friend request
                    await FriendshipModel.findByIdAndDelete(friendRequest._id);

                    return {
                        message: 'Friend request rejected'
                    };
                } else {
                    return {
                        message: 'No pending request from this user'
                    };
                }
            }
        } catch (error) {
            console.error(error);
            throw new ApplicationError('Something went wrong while responding to the friend request', 400);
        }
    }





    // =================================================================
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
            console.error(error);
            throw new ApplicationError('Something went wrong while fetching comments by post ID', 400);
        }
    }

    async add(userId, postId, content) {
        try {
            let newComment = new CommentModel({ userId, postId, content });
            let savedComment = await newComment.save();
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
                    await CommentModel.findByIdAndDelete(id);
                    return;
                } else {
                    throw new ApplicationError('You cannot delete this comment', 403);
                }
            } else {
                throw new ApplicationError('Comment not found', 404);
            }
        } catch (error) {
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
                    const updatedComment = await CommentModel.findByIdAndUpdate(
                        id,
                        { content },
                        { new: true }
                    );
                    return updatedComment;
                } else {
                    throw new ApplicationError('You cannot update this comment', 403);
                }
            } else {
                throw new ApplicationError('Comment not found', 404);
            }
        } catch (error) {
            console.error(error);
            throw new ApplicationError('Something went wrong while updating comment by id', 400);
        }
    }






}