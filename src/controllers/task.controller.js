const taskService = require('../services/task.service');
const logger = require('../utilities/logger');

const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.userId, req.query);
    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"task.controller.js","getTasks()","Error: ${error.message}"`);
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const result = await taskService.createTask(req.userId, req.body);
    logger.info(`"task.controller.js","createTask()","Task created: ${result._id}"`);
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"task.controller.js","createTask()","Error: ${error.message}"`);
    next(error);
  }
};

const toggleTask = async (req, res, next) => {
  try {
    const result = await taskService.toggleTask(req.userId, req.params.id);
    logger.info(`"task.controller.js","toggleTask()","Task toggled: ${req.params.id} -> ${result.completed}"`);
    return res.status(200).json({
      success: true,
      message: 'Task completion state updated',
      data: result
    });
  } catch (error) {
    logger.error(`"task.controller.js","toggleTask()","Error: ${error.message}"`);
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const result = await taskService.updateTask(req.userId, req.params.id, req.body);
    logger.info(`"task.controller.js","updateTask()","Task updated: ${req.params.id}"`);
    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"task.controller.js","updateTask()","Error: ${error.message}"`);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.userId, req.params.id);
    logger.info(`"task.controller.js","deleteTask()","Task deleted: ${req.params.id}"`);
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: result
    });
  } catch (error) {
    logger.error(`"task.controller.js","deleteTask()","Error: ${error.message}"`);
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  toggleTask,
  updateTask,
  deleteTask
};
