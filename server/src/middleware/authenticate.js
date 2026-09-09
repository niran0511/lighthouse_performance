import { User } from '../models/User.js';
import { AppError } from '../utils/app-error.js';
import { verifyToken } from '../utils/token.js';
import { asyncHandler } from '../utils/async-handler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization?.startsWith('Bearer ')) throw new AppError('Authentication is required.', 401, 'AUTH_REQUIRED');

  try {
    const payload = verifyToken(authorization.slice(7));
    const user = await User.findById(payload.sub);
    if (!user) throw new AppError('Your session is no longer valid.', 401, 'INVALID_TOKEN');
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Your session is invalid or has expired.', 401, 'INVALID_TOKEN');
  }
});

