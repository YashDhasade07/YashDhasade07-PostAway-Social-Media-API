import express from 'express'
import LikeController from './like.controller.js';

const likeRouter = express.Router();
let likeController = new LikeController();

// Route to get all likes for a specific post
likeRouter.get('/:postId',(req, res, next) => {
    likeController.get(req, res, next)
})

// Route to toggle the like status for a specific post
likeRouter.post('/toggle/:postId', (req, res, next) => {
    likeController.toggleLikeStatus(req, res, next)
})



export default likeRouter;
