// import CommentModel from "./comment.model.js";
import FriendshipRepository from "./friendship.repository.js";
import ApplicationError from "../../middleware/applicationError.js";
export default class FriendshipController {
    constructor() {
        this.friendshipRepository = new FriendshipRepository();
    }
    async get(req, res, next) {
        try {
            let userId = req.params.id;
            let friends = await this.friendshipRepository.getByUserId(userId);
            if (friends) {
                res.status(200).json(friends)
            }
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }

    async getPendingRequest(req, res, next) {
        try {
            // let friendId = req.params.id;
            let userId = req.userId;
            let data = await this.friendshipRepository.getPendingRequest(userId)
            res.status(200).json(data); 
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }
    }



    async toggleRequest(req, res, next) {
        try {
            let id = req.params.id;
            let userId = req.userId;
           const message= await this.friendshipRepository.toggleRequest(id, userId)
            res.status(200).json(message)
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }
    async respondToRequest(req, res, next) {

        try {
            let friendId = req.params.id;
            let userId = req.userId;
            let { response } = req.body;
            let message = await this.friendshipRepository.respondToRequest(friendId, userId, response);
            res.status(200).json(message)
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }
}
