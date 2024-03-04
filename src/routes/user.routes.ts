import {Router } from "express";
import { authenticateUser, registerUser, deleteUser, updateUser } from "../controllers/user.controller";

const userRouter=Router();
userRouter.post('/login',authenticateUser)
userRouter.post('/register',registerUser);

// incomplete routes
userRouter.delete('/:id',deleteUser)
userRouter.patch('/:id',updateUser);

export {userRouter};