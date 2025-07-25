import { User } from '../models/userModel';

export class UserService {
    async createUser(userData: { firstName: string; lastName: string; email: string }) {
        const user = new User(userData);
        return await user.save();
    }

    async findAllUsers() {
        console.log('Retrieving all users from the database');
        return await User.find();
    }

    async findUserById(userId: string) {
        console.log(`Retrieving user with ID: ${userId}`);
        return await User.findById(userId);
    }
    async updateUser(userId: string, userData: { firstName?: string; lastName?: string; email?: string }) {
        console.log(`Updating user with ID: ${userId}`);
        return await User.findByIdAndUpdate(userId, userData, { new: true });   
    }
}

export default UserService;