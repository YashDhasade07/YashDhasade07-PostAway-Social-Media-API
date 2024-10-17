// import CommentModel from "./comment.model.js";
import CommentRepository from "./comment.repository.js";
import ApplicationError from "../../middleware/applicationError.js";
export default class CommentController {
    constructor() {
        this.commentRepository = new CommentRepository();
    }
    async get(req, res, next) {
        try {
            let postId = req.params.id;
            let comments = await this.commentRepository.getByPostId(postId);
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json("no comments found")
            }
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }

    async create(req, res, next) {
        try {
            let postId = req.params.id;
            let userId = req.userId;
            let content = req.body.content;
            await this.commentRepository.add(userId, postId, content)
            res.status(200).send("comment added sucessfully")
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }
    }



    async delete(req, res, next) {
        try {
            let id = req.params.id;
            let userId = req.userId;
            await this.commentRepository.delete(id, userId)
            res.status(200).send("comment deleted sucessfully")
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }
    async update(req, res, next) {

        try {
            let id = req.params.id;
            let userId = req.userId;
            let { content } = req.body;
            let comment = await this.commentRepository.updateComment(id, userId, content);
            res.status(200).send(`comment updated sucessfully \n${comment}`)
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }
    }
}
