import express from 'express'
import FriendshipController from './friendship.controller.js';

const FriendshipRouter = express.Router();
let friendshipController = new FriendshipController();

FriendshipRouter.get('/get-friends/:id', (req, res, next) => {
    friendshipController.get(req, res, next)
})
FriendshipRouter.get('/get-pending-requests', (req, res, next) => {
    friendshipController.getPendingRequest(req, res, next)
})
FriendshipRouter.post('/toggle-friendship/:id', (req, res, next) => {
    friendshipController.toggleRequest(req, res, next)
})
FriendshipRouter.post('/response-to-request/:id', (req, res, next) => {
    friendshipController.respondToRequest(req, res, next)
})


export default FriendshipRouter;