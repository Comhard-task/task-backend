const { Task, DailyFocusLog } = require('../models');

const getTasks = async (userId, queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const {
    search = '',
    status = 'all',
    category = 'all',
    priority = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = queryParams;

  // Build MongoDB query filter
  const query = { userId };

  // Status filter
  if (status === 'active') {
    query.completed = false;
  } else if (status === 'completed') {
    query.completed = true;
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Priority filter
  if (priority && priority !== 'all') {
    query.priority = priority;
  }

  // Search filter
  if (search && search.trim()) {
    const trimmed = search.trim();
    query.$or = [
      { title: { $regex: trimmed, $options: 'i' } },
      { notes: { $regex: trimmed, $options: 'i' } }
    ];
  }

  // Sorting
  const allowedSortFields = ['createdAt', 'dueDate', 'priority', 'estimatedMinutes', 'title'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions = { [sortField]: sortDirection };

  // Parallel execution for tasks, total count, and summary aggregate
  const [tasks, totalTasks, summaryAggregate] = await Promise.all([
    Task.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Task.countDocuments(query),
    Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalActive: { $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] } },
          totalCompleted: { $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } },
          highPriorityCount: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } }
        }
      }
    ])
  ]);

  const totalPages = Math.ceil(totalTasks / limit) || 1;
  const summary = summaryAggregate[0] || {
    totalActive: 0,
    totalCompleted: 0,
    highPriorityCount: 0
  };

  return {
    tasks,
    pagination: {
      totalTasks,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    summary: {
      totalActive: summary.totalActive,
      totalCompleted: summary.totalCompleted,
      highPriorityCount: summary.highPriorityCount
    }
  };
};

const createTask = async (userId, taskData) => {
  const task = await Task.create({
    ...taskData,
    userId
  });

  return task;
};

const toggleTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    error.code = 'TASK_NOT_FOUND';
    throw error;
  }

  const nextState = !task.completed;
  task.completed = nextState;
  task.completedAt = nextState ? new Date() : null;
  await task.save();

  // Update or record DailyFocusLog for today
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayStr = dayNames[today.getDay()];

    const focusIncrement = nextState ? (task.estimatedMinutes || 30) : -(task.estimatedMinutes || 30);
    const completedIncrement = nextState ? 1 : -1;
    const pendingIncrement = nextState ? -1 : 1;

    await DailyFocusLog.findOneAndUpdate(
      { userId, date: dateStr },
      {
        $setOnInsert: { day: dayStr },
        $inc: {
          completed: completedIncrement,
          pending: pendingIncrement,
          focusMinutes: focusIncrement
        }
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    // Non-blocking telemetry sync error
  }

  return {
    _id: task._id,
    completed: task.completed,
    completedAt: task.completedAt,
    updatedAt: task.updatedAt
  };
};

const updateTask = async (userId, taskId, taskData) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: taskData },
    { new: true, runValidators: true }
  );

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    error.code = 'TASK_NOT_FOUND';
    throw error;
  }

  return task;
};

const deleteTask = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    error.code = 'TASK_NOT_FOUND';
    throw error;
  }

  return { _id: task._id };
};

module.exports = {
  getTasks,
  createTask,
  toggleTask,
  updateTask,
  deleteTask
};
