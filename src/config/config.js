require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskify'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'taskify_default_jwt_secret_dev_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  logDir: process.env.LOG_DIR || 'logs'
};

module.exports = config;
