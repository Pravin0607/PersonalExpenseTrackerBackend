import {Router } from "express";
import { authenticateUser, createUser, deleteUser, updateUser } from "../controllers/user.controller";

const userRouter=Router();
userRouter.get('/user',authenticateUser)
userRouter.post('/create',createUser);
userRouter.delete('/:id',deleteUser)
userRouter.patch('/:id',updateUser);

export {userRouter};