const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

const signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password
  });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    settings: user.settings,
    createdAt: user.createdAt
  };
};

module.exports = {
  signup,
  login,
  getMe,
  generateToken
};
