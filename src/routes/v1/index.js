const express = require('express');
const authRoute = require('./auth.route');
const taskRoute = require('./task.route');
const analyticsRoute = require('./analytics.route');
const settingsRoute = require('./settings.route');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Taskify API v1 is healthy and operational',
    timestamp: new Date().toISOString()
  });
});

// Mount modules
router.use('/auth', authRoute);
router.use('/tasks', taskRoute);
router.use('/analytics', analyticsRoute);
router.use('/settings', settingsRoute);

module.exports = router;
