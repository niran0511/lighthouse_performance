import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase(uri = config.mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

