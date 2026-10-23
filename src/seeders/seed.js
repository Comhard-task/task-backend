const connectDB = require('../config/db');
const { User, Task, DailyFocusLog } = require('../models');
const logger = require('../utilities/logger');

const demoTasks = [
  {
    title: 'Morning mindful reflection & intentional planning',
    notes: 'Journal 3 key intentions before opening digital communication channels.',
    category: 'Mindfulness & Health',
    priority: 'High',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 4),
    dueDate: 'Today, 8:00 AM',
    estimatedMinutes: 30
  },
  {
    title: 'Deep focus: Architectural design for distributed systems',
    notes: 'Draft specifications for event-driven streaming and persistence pipeline.',
    category: 'Deep Focus',
    priority: 'High',
    completed: false,
    completedAt: null,
    dueDate: 'Today, 11:30 AM',
    estimatedMinutes: 90
  },
  {
    title: 'Literature review on cognitive ergonomics & flow states',
    notes: 'Synthesize research papers on attention residue and task transitions.',
    category: 'Learning & Growth',
    priority: 'Medium',
    completed: false,
    completedAt: null,
    dueDate: 'Tomorrow',
    estimatedMinutes: 45
  },
  {
    title: 'Organize workspace & cleanse digital clutter',
    notes: 'Clear desktop, archive completed project documents, reset physical desk.',
    category: 'Life & Admin',
    priority: 'Gentle',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2),
    dueDate: 'Today',
    estimatedMinutes: 20
  },
  {
    title: 'Evening restorative yoga and somatic meditation',
    notes: 'Disconnect from all screens and cultivate nervous system balance.',
    category: 'Mindfulness & Health',
    priority: 'Gentle',
    completed: false,
    completedAt: null,
    dueDate: 'Today, 7:30 PM',
    estimatedMinutes: 45
  },
  {
    title: 'Deep focus writing: Draft personal reflections essay',
    notes: 'Focus on chapter 3 ideas and core personal values.',
    category: 'Deep Focus',
    priority: 'High',
    completed: false,
    completedAt: null,
    dueDate: 'Today',
    estimatedMinutes: 90
  }
];

const seedData = async () => {
  try {
    await connectDB();

    const email = 'eleanor@newlight.space';
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: 'Eleanor Vance',
        email,
        password: 'SecurePassword123!',
        settings: {
          dailyGoal: 5,
          dailyFocusMinutes: 180,
          gentleReminders: true,
          digitalDetoxReminder: true
        }
      });
      logger.info(`"seed.js","seedData()","Demo user created: ${user.email}"`);
    }

    const taskCount = await Task.countDocuments({ userId: user._id });
    if (taskCount === 0) {
      const tasksWithUser = demoTasks.map((t) => ({ ...t, userId: user._id }));
      await Task.insertMany(tasksWithUser);
      logger.info(`"seed.js","seedData()","Seeded ${tasksWithUser.length} mindful demo tasks"`);
    }

    // Seed weekly focus logs
    const logCount = await DailyFocusLog.countDocuments({ userId: user._id });
    if (logCount === 0) {
      const now = new Date();
      const currentDayOfWeek = now.getDay() || 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - currentDayOfWeek + 1);

      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const sampleStats = [
        { completed: 6, pending: 2, focusMinutes: 180 },
        { completed: 8, pending: 1, focusMinutes: 240 },
        { completed: 5, pending: 3, focusMinutes: 160 },
        { completed: 9, pending: 2, focusMinutes: 270 },
        { completed: 7, pending: 1, focusMinutes: 210 },
        { completed: 4, pending: 2, focusMinutes: 120 },
        { completed: 6, pending: 1, focusMinutes: 150 }
      ];

      const logsToInsert = dayNames.map((dayName, idx) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + idx);
        return {
          userId: user._id,
          date: d.toISOString().split('T')[0],
          day: dayName,
          completed: sampleStats[idx].completed,
          pending: sampleStats[idx].pending,
          focusMinutes: sampleStats[idx].focusMinutes
        };
      });

      await DailyFocusLog.insertMany(logsToInsert);
      logger.info('"seed.js","seedData()","Seeded weekly telemetry logs"');
    }

    logger.info('"seed.js","seedData()","Seeding completed successfully"');
    return user;
  } catch (error) {
    logger.error(`"seed.js","seedData()","Seeding error: ${error.message}"`);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedData;
