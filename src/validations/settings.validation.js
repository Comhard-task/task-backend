const Joi = require('joi');

const updateSettingsSchema = Joi.object({
  dailyGoal: Joi.number().integer().min(1).max(20),
  dailyFocusMinutes: Joi.number().integer().min(15).max(600),
  gentleReminders: Joi.boolean(),
  digitalDetoxReminder: Joi.boolean()
}).min(1);

module.exports = {
  updateSettingsSchema
};
