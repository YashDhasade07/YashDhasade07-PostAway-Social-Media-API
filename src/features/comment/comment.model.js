import ApplicationError from "../../middleware/applicationError.js";
import UserModel from "../user/user.model.js";
import PostModel from "../post/post.model.js";
export default class CommentModel {
    constructor(id, userId, postId, content) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.content = content;
    }

    static add(userId, postId, content) {
        let user = UserModel.get().find((u) => u.id == userId)
        if (!user) {
            throw new ApplicationError('User not Found, plese enter valid userId', 404)
        }
        let post = PostModel.get().find((p) => p.id == postId)
        if (!post) {
            throw new ApplicationError('Post not Found, plese enter valid postId', 404)
        }

        let id = comments.length + 1;
        let newComment = new CommentModel(id, userId, postId, content);
        comments.push(newComment);
    }


    static getByPostId(postId) {
        let post = PostModel.get().find((p) => p.id == postId)
        if (!post) {
            throw new ApplicationError('Post not Found, plese enter valid postId', 404)
        }

        const postComments = comments.filter((c) => c.postId == postId)
        return postComments;
    }

    static updateComment(id, userId, postId, content) {
        let comment = comments.find((c)=>c.id == id);
        if (!comment) {
            throw new ApplicationError('Commemt not Found, plese enter valid commentId', 404)
        }

        let user = UserModel.get().find((u) => u.id == userId)
        if (!user) {
            throw new ApplicationError('User not Found, plese enter valid userId', 404)
        }
        let post = PostModel.get().find((p) => p.id == postId)
        if (!post) {
            throw new ApplicationError('Post not Found, plese enter valid postId', 404)
        }

        let index = comments.findIndex((c) => c.id == id);
        let newComment = new CommentModel(id, userId, postId, content);
        comments[index] = newComment;
    }


    static delete(id) {
        let comment = comments.find((c)=>c.id == id);
        if (!comment) {
            throw new ApplicationError('Commemt not Found, plese enter valid commentId', 404)
        }
        let index = comments.findIndex((c) => c.id == id);
        comments.splice(index, 1);
    }
}

var comments = []