import express from 'express';
import { createUserController, createUsersController, deleteUserController, deleteUsersController, getAllUsersController, updateUserController } from '../controllers/userControllers';
import { authToken } from '../middlewares/loginMiddleware';
import { loginController, updateRefreshTokenController } from '../controllers/loginControllers';

export const loginRouter = express.Router();

loginRouter.post('/auth', loginController);
loginRouter.post('/users', createUserController);
loginRouter.post('/users-batch', createUsersController);
loginRouter.get('/users/:page', getAllUsersController);
loginRouter.get('/protected', authToken, getAllUsersController);
loginRouter.delete('/user/:id', deleteUserController);
loginRouter.delete('/users', deleteUsersController);
loginRouter.post('/refresh', updateRefreshTokenController);
loginRouter.put('/users', updateUserController);