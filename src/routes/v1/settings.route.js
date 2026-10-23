const express = require('express');
const settingsController = require('../../controllers/settings.controller');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { updateSettingsSchema } = require('../../validations/settings.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', settingsController.getSettings);
router.put('/', validate(updateSettingsSchema, 'body'), settingsController.updateSettings);

module.exports = router;
