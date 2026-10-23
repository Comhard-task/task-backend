const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).required().messages({
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is required'
  }),
  notes: Joi.string().allow('').trim().default(''),
  category: Joi.string()
    .valid(
      'Mindfulness & Health',
      'Deep Focus',
      'Learning & Growth',
      'Life & Admin'
    )
    .default('Deep Focus'),
  priority: Joi.string()
    .valid('High', 'Medium', 'Gentle')
    .default('Medium'),
  dueDate: Joi.string().allow('').trim().default('Today'),
  estimatedMinutes: Joi.number().integer().min(5).max(480).default(30)
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(255),
  notes: Joi.string().allow('').trim(),
  category: Joi.string().valid(
    'Mindfulness & Health',
    'Deep Focus',
    'Learning & Growth',
    'Life & Admin'
  ),
  priority: Joi.string().valid('High', 'Medium', 'Gentle'),
  completed: Joi.boolean(),
  dueDate: Joi.string().allow('').trim(),
  estimatedMinutes: Joi.number().integer().min(5).max(480)
}).min(1);

const getTasksQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().allow('').trim().default(''),
  status: Joi.string().valid('all', 'active', 'completed').default('all'),
  category: Joi.string().default('all'),
  priority: Joi.string().default('all'),
  sortBy: Joi.string()
    .valid('createdAt', 'dueDate', 'priority', 'estimatedMinutes', 'title')
    .default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema
};
