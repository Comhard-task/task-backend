const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSettingsSchema = new mongoose.Schema(
  {
    dailyGoal: {
      type: Number,
      default: 5,
      min: 1,
      max: 20
    },
    dailyFocusMinutes: {
      type: Number,
      default: 180,
      min: 15,
      max: 600
    },
    gentleReminders: {
      type: Boolean,
      default: true
    },
    digitalDetoxReminder: {
      type: Boolean,
      default: true
    }
  },
  { _id: false, timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Excluded from query results by default
    },
    settings: {
      type: UserSettingsSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
