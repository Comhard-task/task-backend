const logger = require('../utilities/logger');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        issue: detail.message.replace(/['"]/g, '')
      }));

      logger.error(`"validate.js","validationMiddleware()","Validation failed for ${req.originalUrl}: ${error.message}"`);

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message.replace(/['"]/g, ''),
          details
        }
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = validate;
