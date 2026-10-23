const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  })
});

module.exports = {
  signupSchema,
  loginSchema
};
