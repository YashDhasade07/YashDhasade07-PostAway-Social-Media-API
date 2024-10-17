import express from 'express'
import CommentController from './comment.controller.js';

const CommentRouter = express.Router();
let commentController = new CommentController();

CommentRouter.get('/:id', (req, res, next) => {
    commentController.get(req, res, next)
})
CommentRouter.post('/:id', (req, res, next) => {
    commentController.create(req, res, next)
})
CommentRouter.delete('/:id', (req, res, next) => {
    commentController.delete(req, res, next)
})
CommentRouter.put('/:id', (req, res, next) => {
    commentController.update(req, res, next)
})


export default CommentRouter;