import express from 'express';
import {getCurrentUser , loginUser, registerUser, updatePassword, updateProfile} from '../controllers/userController.js'
import authMiddleware from '../middelware/auth.js'
const userRouter = express.Router();

//public links

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);


//Private links protect also

userRouter.get('/me',authMiddleware ,getCurrentUser);
userRouter.put('/profile',authMiddleware, updateProfile);
userRouter.put('/password',authMiddleware, updatePassword);


export default userRouter;