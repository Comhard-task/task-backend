const express = require('express');
const analyticsController = require('../../controllers/analytics.controller');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/weekly', analyticsController.getWeeklyTelemetry);
router.get('/dimensions', analyticsController.getDimensions);

module.exports = router;
