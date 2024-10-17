// import LikeModel from "./like.model.js";
import LikeRepository from "./like.reopsitory.js";
import ApplicationError from "../../middleware/applicationError.js";
export default class LikeController {
    // Retrieve all likes for a specific post
    constructor() {
        this.likeRepository = new LikeRepository();
    }
    async get(req, res, next) {
        try {
            let postId = req.params.postId;
            let likes = await this.likeRepository.getByPostId(postId)
            res.status(200).json(likes);
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }


    }

    // Toggle like status for a specific post by the current user
    async toggleLikeStatus(req, res, next) {

        try {
            let postId = req.params.postId;
            let userId = req.userId;
            let type = req.body.types ; 
            let message = await this.likeRepository.toggle(userId, postId , type)
            res.status(200).send(message);
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }


}
