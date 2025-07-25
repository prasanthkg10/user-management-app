import { Router } from 'express';
import UserController from '../controllers/userController';
import { validateUser } from '../middlewares/validationMiddleware';

const router = Router();
const userController = new UserController();

const setUserRoutes = (app: unknown) => {
    router.post('/users', validateUser, userController.createUser.bind(userController));
    router.get('/users', userController.getUsers.bind(userController));
    router.get('/users/:id', userController.getUserById.bind(userController));
    router.put('/users/:id', validateUser, userController.updateUser.bind(userController));
    router.delete('/users/:id', userController.deleteUser.bind(userController));
    router.get('/', (req, res) => {
        res.send('Welcome to the User API');
    });
    return router;
};

export default setUserRoutes;