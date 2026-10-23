const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters']
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: {
        values: [
          'Mindfulness & Health',
          'Deep Focus',
          'Learning & Growth',
          'Life & Admin'
        ],
        message: '{VALUE} is not a valid category'
      },
      default: 'Deep Focus',
      index: true
    },
    priority: {
      type: String,
      enum: {
        values: ['High', 'Medium', 'Gentle'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'Medium',
      index: true
    },
    completed: {
      type: Boolean,
      default: false,
      index: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    dueDate: {
      type: String,
      default: 'Today',
      trim: true
    },
    estimatedMinutes: {
      type: Number,
      default: 30,
      min: 5,
      max: 480
    }
  },
  {
    timestamps: true
  }
);

// Optimized compound indexes per SCHEMA.md
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, completed: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, category: 1, completed: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ title: 'text', notes: 'text' });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
