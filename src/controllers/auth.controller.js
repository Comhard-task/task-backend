const authService = require('../services/auth.service');
const logger = require('../utilities/logger');

const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    logger.info(`"auth.controller.js","signup()","User registered: ${result.user.email}"`);
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"auth.controller.js","signup()","Signup error: ${error.message}"`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    logger.info(`"auth.controller.js","login()","User logged in: ${result.user.email}"`);
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"auth.controller.js","login()","Login error: ${error.message}"`);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const result = await authService.getMe(req.userId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`"auth.controller.js","getMe()","getMe error: ${error.message}"`);
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe
};
