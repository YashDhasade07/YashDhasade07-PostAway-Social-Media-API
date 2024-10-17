import express from 'express'
import PostController from './post.controller.js';
// Middleware for handling file uploads
import { upload } from '../../middleware/fileUpload.Middleware.js'; 

const postRouter = express.Router();
let postController = new PostController();

// Route to get all posts
postRouter.get('/all', (req, res, next) => {
    postController.getAll(req, res, next)
});

// Route to get a post by ID
postRouter.get('/:id', (req, res, next) => {
    postController.getPost(req, res, next)
});

// Route to get all posts by the current user
postRouter.get('/user/:id', (req, res, next) => {
    postController.getUserPosts(req, res, next)
});

// Route to create a new post (with image upload)
postRouter.post('/', upload.single('imageUrl'), (req, res, next) => {
    postController.create(req, res, next)
});

// Route to delete a post by ID
postRouter.delete('/:id', (req, res, next) => {
    postController.delete(req, res, next)
});

// Route to update a post by ID (with image upload)
postRouter.put('/:id', upload.single('imageUrl'), (req, res, next) => {
    postController.update(req, res, next)
});

export default postRouter;
