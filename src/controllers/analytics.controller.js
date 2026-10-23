const analyticsService = require('../services/analytics.service');
const logger = require('../utilities/logger');

const getWeeklyTelemetry = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await analyticsService.getWeeklyStats(req.userId, startDate, endDate);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`"analytics.controller.js","getWeeklyTelemetry()","Error: ${error.message}"`);
    next(error);
  }
};

const getDimensions = async (req, res, next) => {
  try {
    const result = await analyticsService.getDimensions(req.userId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`"analytics.controller.js","getDimensions()","Error: ${error.message}"`);
    next(error);
  }
};

module.exports = {
  getWeeklyTelemetry,
  getDimensions
};
