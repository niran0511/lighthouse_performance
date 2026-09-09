import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AppError } from '../utils/app-error.js';
import { signToken } from '../utils/token.js';
import { validateLogin, validateRegistration } from '../validators/auth-validator.js';

function authenticationResponse(user) {
  return { success: true, token: signToken(user._id), user: user.toPublicJSON() };
}

export async function register(req, res) {
  const { name, email, password } = validateRegistration(req.body);
  const existingUser = await User.exists({ email });
  if (existingUser) throw new AppError('An account with this email already exists.', 409, 'DUPLICATE_RESOURCE');
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json(authenticationResponse(user));
}

export async function login(req, res) {
  const { email, password } = validateLogin(req.body);
  const user = await User.findOne({ email }).select('+password');
  const isMatch = user && await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Email or password is incorrect.', 401, 'AUTH_FAILED');
  res.status(200).json(authenticationResponse(user));
}

export async function me(req, res) {
  res.json({ success: true, user: req.user.toPublicJSON() });
}

