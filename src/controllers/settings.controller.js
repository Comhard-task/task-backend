const settingsService = require('../services/settings.service');
const logger = require('../utilities/logger');

const getSettings = async (req, res, next) => {
  try {
    const result = await settingsService.getSettings(req.userId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`"settings.controller.js","getSettings()","Error: ${error.message}"`);
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const result = await settingsService.updateSettings(req.userId, req.body);
    logger.info(`"settings.controller.js","updateSettings()","Settings updated for user ${req.userId}"`);
    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"settings.controller.js","updateSettings()","Error: ${error.message}"`);
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
