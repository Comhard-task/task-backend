const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utilities/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    logger.info(`"db.js","connectDB()","MongoDB Connected: ${conn.connection.host}/${conn.connection.name}"`);
    return conn;
  } catch (error) {
    logger.error(`"db.js","connectDB()","MongoDB Connection Error: ${error.message}"`);
    throw error;
  }
};

module.exports = connectDB;
