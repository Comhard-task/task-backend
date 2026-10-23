const express = require('express');
const taskController = require('../../controllers/task.controller');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema
} = require('../../validations/task.validation');

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/', validate(getTasksQuerySchema, 'query'), taskController.getTasks);
router.post('/', validate(createTaskSchema, 'body'), taskController.createTask);
router.patch('/:id/toggle', taskController.toggleTask);
router.put('/:id', validate(updateTaskSchema, 'body'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
