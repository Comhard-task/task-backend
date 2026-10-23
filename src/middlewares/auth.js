const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const logger = require('../utilities/logger');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token missing or invalid format'
        }
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'The user belonging to this token no longer exists'
        }
      });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    logger.error(`"auth.js","auth()","Token verification failed: ${error.message}"`);
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired authentication token'
      }
    });
  }
};

module.exports = auth;
