const { User } = require('../models');

const getSettings = async (userId) => {
  const user = await User.findById(userId).select('settings');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return (
    user.settings || {
      dailyGoal: 5,
      dailyFocusMinutes: 180,
      gentleReminders: true,
      digitalDetoxReminder: true
    }
  );
};

const updateSettings = async (userId, settingsData) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  user.settings = {
    ...(user.settings ? user.settings.toObject() : {}),
    ...settingsData
  };

  await user.save();

  return {
    dailyGoal: user.settings.dailyGoal,
    dailyFocusMinutes: user.settings.dailyFocusMinutes,
    gentleReminders: user.settings.gentleReminders,
    digitalDetoxReminder: user.settings.digitalDetoxReminder,
    updatedAt: user.updatedAt
  };
};

module.exports = {
  getSettings,
  updateSettings
};
