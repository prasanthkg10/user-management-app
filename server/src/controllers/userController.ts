import { Request, Response } from 'express';
import { UserService } from '../services/userService';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.userService.createUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: 'Unknown error' });
        }
    }

    public async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            console.log('Fetching all users');

            const users = await this.userService.findAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Unknown error' });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        const userId = req.params.id;

        try {
            console.log(`Fetching user with ID: ${userId}`);

            const user = await this.userService.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Unknown error' });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const userId = req.params.id;

        try {
            console.log(`Deleting user with ID: ${userId}`);

            const user = await this.userService.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.remove();
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Unknown error' });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const userId = req.params.id;

        try {
            console.log(`Updating user with ID: ${userId}`);

            const user = await this.userService.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const updatedUser = await this.userService.updateUser(userId, req.body);
            return res.status(200).json(updatedUser);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Unknown error' });
        }
    }
}

export default UserController;