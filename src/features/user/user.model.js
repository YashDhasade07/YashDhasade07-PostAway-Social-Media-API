import ApplicationError from "../../middleware/applicationError.js";
export default class UserModel {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    // Get all users

    static get() {
        return users;
    }

    // Add a new user

    static add(name, email, password) {
        if (!name) {
            throw new ApplicationError('name cannot be empty', 400)
        }
        if (!email) {
            throw new ApplicationError('email cannot be empty', 400)
        }
        if (!password) {
            throw new ApplicationError('password cannot be empty', 400)
        }
        let id = users.length + 1;
        let newUser = new UserModel(id, name, email, password);
        users.push(newUser);
    }
    // Confirm user login credentials

    static confirmLogin(email, password) {
        if (!email) {
            throw new ApplicationError('email cannot be empty', 400)
        }
        if (!password) {
            throw new ApplicationError('password cannot be empty', 400)
        }
                // Find user with matching email and password

        let isValid = users.find((u) => u.email == email && u.password == password);
        return isValid;
    }
}

var users = []