import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';

async function start() {
  await connectDatabase();
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.info(`Lighthouse Monitor API listening on port ${config.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      const { default: mongoose } = await import('mongoose');
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error('Unable to start Lighthouse Monitor API:', error.message);
  process.exit(1);
});

