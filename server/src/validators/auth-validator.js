import { AppError } from '../utils/app-error.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(body = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (name.length < 2 || name.length > 80) throw new AppError('Name must contain 2 to 80 characters.', 400, 'INVALID_NAME');
  if (!emailPattern.test(email) || email.length > 254) throw new AppError('Enter a valid email address.', 400, 'INVALID_EMAIL');
  if (password.length < 8 || password.length > 128) throw new AppError('Password must contain 8 to 128 characters.', 400, 'INVALID_PASSWORD');
  return { name, email, password };
}

export function validateLogin(body = {}) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!emailPattern.test(email) || !password) throw new AppError('Email and password are required.', 400, 'INVALID_CREDENTIALS');
  return { email, password };
}

