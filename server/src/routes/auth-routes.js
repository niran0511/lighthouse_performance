import { Router } from 'express';
import { login, me, register } from '../controllers/auth-controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { asyncHandler } from '../utils/async-handler.js';

export const authRouter = Router();
authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.get('/me', authenticate, asyncHandler(me));

