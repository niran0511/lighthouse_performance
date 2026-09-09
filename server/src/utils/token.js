import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

