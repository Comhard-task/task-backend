const mongoose = require('mongoose');

const DailyFocusLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    day: {
      type: String, // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
      required: true
    },
    completed: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    focusMinutes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// One daily log record per user per calendar day
DailyFocusLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyFocusLog = mongoose.model('DailyFocusLog', DailyFocusLogSchema);

module.exports = DailyFocusLog;
