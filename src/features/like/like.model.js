import UserModel from "../user/user.model.js";
import ApplicationError from "../../middleware/applicationError.js";
import PostModel from "../post/post.model.js";
export default class LikeModel {
    constructor(id, userId, postId) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }

     // Toggle the like status for a post by a user
    static toggle(userId, postId) {
        let user = UserModel.get().find((u)=>u.id==userId)
        if(!user){
            throw new ApplicationError('User not Found, plese enter valid userId',404)
          }
        let post = PostModel.get().find((p)=>p.id == postId)
        if(!post){
            throw new ApplicationError('Post not Found, plese enter valid postId',404)
          }

          // Find if the like already exists (if user has liked this post)
        let likeIndex = likes.findIndex((l) => l.userId == userId && l.postId == postId)
       // If like exists, remove it (unlike)
        if (likeIndex >= 0) {
            likes.splice(likeIndex, 1)
            return 'like has been removed'
        } else {
            let id = likes.length + 1;
            let newLike = new LikeModel(id, userId, postId);
            likes.push(newLike);
            return 'like has been added'
        }


    }


     // Get all likes for a specific post by post ID
    static getByPostId(postId) {
        let post = PostModel.get().find((p)=>p.id == postId)
        if(!post){
            throw new ApplicationError('Post not Found, plese enter valid postId',404)
          }
          // Filter and return all likes for the given post
        const postLikes = likes.filter((l) => l.postId == postId)
        
        return postLikes;
    }

}

var likes = []
