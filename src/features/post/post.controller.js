// import PostModel from "./post.model.js";
import PostRepository from "./post.repository.js";
import ApplicationError from "../../middleware/applicationError.js";
export default class PostController {

    constructor() {
        this.postRepository = new PostRepository();
    }
    async getAll(req, res, next) {
        try {
            let allPosts = await this.postRepository.get();
            res.status(200).json(allPosts)
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }

    async getPost(req, res, next) {
        try {
            let id = req.params.id;
            let post = await this.postRepository.getByPostId(id);
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).send('post not found')
            }
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }
    }

    async getUserPosts(req, res, next) {
        try {
            let userId = req.params.id;
            // let userId = req.userId;
            let userPost = await this.postRepository.getByUserId(userId);
            if (userPost.length >= 0) {
                res.status(200).json(userPost)
            } else {
                res.status(404).send('user has no posts')
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
            let imageUrl = req.file.filename;
            let userId = req.userId;
            let caption = req.body.caption;
            let post = await this.postRepository.add(userId, caption, imageUrl)
            res.status(200).send(`Post added sucessfully \n ${post}`)
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
            await this.postRepository.delete(id , userId);
            res.status(200).send('post deleted sucessfully');
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next( new ApplicationError('Something went wrong while deleting the post', 400))
            
        }

    }
    async update(req, res, next) {
        try {
            let id = req.params.id;
            let imageUrl = req.file.filename;
            let userId = req.userId;
            let caption = req.body.caption;
            await this.postRepository.updatePost(id, userId, caption, imageUrl);
            res.status(200).send('Post updated sucessfully')
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
            
        }

    }
}