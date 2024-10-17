
import jwt from 'jsonwebtoken'
import TokenRepository from '../config/token.repository.js';

const jwtAuth = async (req, res, next) => {

    const token = req.headers['authorization'];// Get token from headers
    
    if (!token) {
        res.status(401).send('unauthorized');  // If no token, respond with 401
    }

    try {
        const tokenRepo = new TokenRepository();
       
        // console.log(`Checking token: ${token}`);
        const blacklistedToken = await tokenRepo.find(token);
        // console.log(`///// ${blacklistedToken}`);
        if (!blacklistedToken) {  
            // console.log('Token is blacklisted');
            return res.status(401).send('Token is not valid , please enter valid token/login Key');
        }
        const code = jwt.verify(token, 'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz') // Verify token using secret key
        
        req.userId = code.UserId; // Attach user ID to request object 
 
        next()
    } catch (err) {
        // console.log('Token is blacklisted');
        res.status(401).send('unauthorized token');
    }

}

export default jwtAuth;

