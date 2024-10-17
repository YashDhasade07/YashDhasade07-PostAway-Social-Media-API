import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const userRouter = express.Router();
let userController = new UserController();

// Routes for user registration and login
userRouter.post('/signup', (req, res, next) => {
    userController.registration(req, res, next)
});
userRouter.post('/signin', (req, res, next) => {
    userController.login(req, res, next)
});
userRouter.post('/logout', jwtAuth, (req, res, next) => userController.logout(req, res, next)); // Logout
userRouter.post('/logout-all-devices', jwtAuth, (req, res, next) => userController.logoutFromAllDevices(req, res, next)); // Logout from all devices
userRouter.get('/get-details/:id',jwtAuth, (req, res, next) => {
    userController.getUserDetails(req, res, next)
});
userRouter.get('/get-all-details/',jwtAuth, (req, res, next) => {
    userController.getAllDetails(req, res, next)
});
userRouter.put('/update-details/:id',jwtAuth, (req, res, next) => {
    userController.updateUser(req, res, next)
});
export default userRouter;
