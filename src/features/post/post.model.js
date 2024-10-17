import ApplicationError from "../../middleware/applicationError.js";
import UserModel from "../user/user.model.js";
export default class PostModel {
    constructor(id, userId, caption, imageUrl) {
        this.id = id;  // Post ID
        this.userId = userId;  // Reference to user who created the post
        this.caption = caption;  // Post caption
        this.imageUrl = imageUrl;  // Path to the post's image
    }

    static get() {
        return posts;
    }

    static add(userId, caption, imageUrl) {
        let user = UserModel.get().find((u) => u.id == userId)
        if (!user) {
            throw new ApplicationError('User not Found, plese enter valid userId', 404)
        }


        let id = posts.length + 1;
        let newPost = new PostModel(id, userId, caption, imageUrl);
        posts.push(newPost);   // Add new post to the posts array
    }

    static getByPostId(id) {
        const post = posts.find((p) => p.id == id)
        return post; // / Find and return post by ID
    }

    static getByUserId(userId) {
        let user = UserModel.get().find((u) => u.id == userId)
        if (!user) {
            throw new ApplicationError('User not Found, plese enter valid userId', 404)
        }
        const userPosts = posts.filter((p) => p.userId == userId) // Retrieve all posts by a specific user
        return userPosts;
    }

    static updatePost(id, userId, caption, imageUrl) {
        let post = posts.find((p) => p.id == id);
        if (!post) {
            throw new ApplicationError('Post not Found, plese enter valid postId', 404)
        }
        let user = UserModel.get().find((u) => u.id == userId)
        if (!user) {
            throw new ApplicationError('User not Found, plese enter valid userId', 404)
        }

        let index = posts.findIndex((p) => p.id == id);
        let newPost = new PostModel(id, userId, caption, imageUrl);
        posts[index] = newPost;   // Update the post in the array
    }


    static delete(id) {
        let post = posts.find((p) => p.id == id);
        if (!post) {
            throw new ApplicationError('Post not Found, plese enter valid postId', 404)
        }
        let index = posts.findIndex((p) => p.id == id);
        posts.splice(index, 1);  // Remove the post from the array
    }
}

var posts = []