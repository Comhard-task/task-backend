const http = require('http');
const app = require('./app');
const config = require('./src/config/config');
const connectDB = require('./src/config/db');
const logger = require('./src/utilities/logger');
const seedData = require('./src/seeders/seed');

let server;

async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Seed initial demo data in development mode
    if (config.env === 'development') {
      try {
        await seedData();
      } catch (seedErr) {
        logger.error(`"server.js","startServer()","Seed notice: ${seedErr.message}"`);
      }
    }

    // 3. Create HTTP server
    server = http.createServer(app);

    server.listen(config.port, () => {
      logger.info(
        `"server.js","startServer()","Taskify Backend API is running on http://localhost:${config.port} in ${config.env} mode"`
      );
      console.log(`\n======================================================`);
      console.log(`Taskify API Server Started!`);
      console.log(`URL: http://localhost:${config.port}/api/v1`);
      console.log(`Health: http://localhost:${config.port}/api/v1/health`);
      console.log(`Default User: eleanor@newlight.space | SecurePassword123!`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    logger.error(`"server.js","startServer()","Failed to start server: ${err.message}"`);
    console.error('Server failed to start:', err);
    process.exit(1);
  }
}

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('"server.js","exitHandler()","Server shut down gracefully"');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('uncaughtException', (err) => {
  logger.error(`"server.js","uncaughtException","${err.message}"`);
  exitHandler();
});

process.on('unhandledRejection', (err) => {
  logger.error(`"server.js","unhandledRejection","${err.message}"`);
  exitHandler();
});

process.on('SIGTERM', () => {
  logger.info('"server.js","SIGTERM","SIGTERM signal received"');
  exitHandler();
});

process.on('SIGINT', () => {
  logger.info('"server.js","SIGINT","SIGINT signal received"');
  exitHandler();
});

startServer();
