import 'dotenv/config';

const requiredInProduction = ['MONGO_URI', 'JWT_SECRET'];

export function getConfig() {
  const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lighthouse_monitor',
    jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
    lighthouseTimeoutMs: Number(process.env.LIGHTHOUSE_TIMEOUT_MS || 120_000),
  };

  if (config.env === 'production') {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return config;
}

export const config = getConfig();

