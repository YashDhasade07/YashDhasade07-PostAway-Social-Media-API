import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import userRouter from './src/features/user/user.routes.js';
import postRouter from './src/features/post/post.routes.js';
import CommentRouter from './src/features/comment/comment.routes.js';
import FriendshipRouter from './src/features/friendship/friendship.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import otpRouter from './src/features/otp/otp.routes.js';
import jwtAuth from './src/middleware/jwt.middleware.js';
import ApplicationError from './src/middleware/applicationError.js';
import loggerMiddleware from './src/middleware/logger.middleware.js';
import mongoose from 'mongoose';
import { connectUsingMongoose } from './src/config/mongoose.js';
let server = express();

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(cors());
server.use(cookieParser());
server.use(express.json());
server.use(bodyParser.json());

server.use('/api/likes', jwtAuth, loggerMiddleware, likeRouter)
server.use('/api/comments', jwtAuth, loggerMiddleware, CommentRouter)
server.use('/api/posts', jwtAuth, loggerMiddleware, postRouter)
server.use('/api/friends', jwtAuth, loggerMiddleware, FriendshipRouter)
server.use('/api/otp', jwtAuth, otpRouter)
server.use('/api/users', userRouter)



server.use((err, req, res, next) => {
    console.log(err);
    console.log(`///////////////12`);
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message)
    }
    res.status(500).send('Something went wrong')
})

server.use((req, res) => {
    res.status(404).send('Requset API not found')

})
server.listen(3000, () => {
    console.log('Server is listening on port 3000'); 
    connectUsingMongoose();
})