// import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken'
import UserRepository from "./user.repository.js";
import ApplicationError from "../../middleware/applicationError.js";
import bcrypt from 'bcrypt';
import TokenRepository from "../../config/token.repository.js";


export default class UserController {
    // Handle user registration
    constructor() {
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
    }

    async registration(req, res, next) {
        try {
            const { name, email, password, gender } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            let user = await this.userRepository.add(name, email, hashedPassword, gender);
            res.status(200).send(`user is been added sucessfully \n${user}`)

        } catch (error) {
            console.log(error);
            next(new ApplicationError('Something went wrong', 400))
        }
    }

    // Handle user login and issue JWT


    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            let result =await this.userRepository.findByEmail(email);
            if (result) {
                const isPassword = await bcrypt.compare(password, result.password);
                if (isPassword) {
                    // Generate a JWT with 1-hour expiration
                    const token = jwt.sign({ UserId: result._id, email: result.email }, 'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz', {
                        expiresIn: '1h'
                    });
                    await this.tokenRepository.add(token, result._id);
                    return res.status(200).send(token)
                } else {
                    res.status(400).send('incorrect credentials')
                }
            } else {
                res.status(400).send('incorrect credentials')
            }
        } catch (error) {
            if (error instanceof ApplicationError) {
                next(error);
            }
            next(new ApplicationError('Something went wrong', 400))
        }

    }

    async logout(req, res, next) {
        try {
            const token = req.headers['authorization'];
            await this.tokenRepository.delete(token); // Remove token from the database
            res.status(200).send('Logged out successfully');
        } catch (error) {
            
            next(error);
        }
    }

    // Logout from all devices (Invalidate all tokens)
    async logoutFromAllDevices(req, res, next) {
        try {
            const userId = req.userId; // Extract from JWT
            await this.tokenRepository.deleteAllForUser(userId); // Remove all tokens for the user
            res.status(200).send('Logged out from all devices successfully');
        } catch (error) {
            next(error);
        }
    }


    async getUserDetails(req, res, next) {
        try {
            const userId = req.params.id; 
           const user = await this.userRepository.getDetails(userId); // Remove all tokens for the user
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
    async getAllDetails(req, res, next) {
        try {
           const users = await this.userRepository.getAllDetails(); // Remove all tokens for the user
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            let id =req.params.id;
            let userId = req.userId;
            if(userId != id){
                throw new ApplicationError('you cant update other user details', 400)
            }
            const {name , email , gender } = req.body;
           const users = await this.userRepository.updateDetails(userId,name, email , gender); 
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    } 



}