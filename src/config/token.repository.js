import TokenModel from './token.model.js';
import ApplicationError from '../middleware/applicationError.js';

export default class TokenRepository {
    async add(token, userId) {
        try {
            const newToken = new TokenModel({ token, userId });
            await newToken.save();
        } catch (error) {
            throw new ApplicationError('Could not add token', 500);
        }
    }

    async find(token) {
        return await TokenModel.findOne({ token });
    }

    async delete(token) {
        await TokenModel.deleteOne({ token });
    }

    async deleteAllForUser(userId) {
        await TokenModel.deleteMany({ userId });
    }
}
