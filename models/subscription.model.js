import mongoose from "mongoose";
import dayjs from 'dayjs';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'subscription price is required'],
    min: [0, 'price must be greater than 0'],
    max: [1000, 'price must be less than 1000']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP'],
    default: 'USD'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: [true, 'Subscription frequency is required']  // Ensures no invalid/undefined
  },
  category: {
    type: String,
    enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'Start date must be in the past or today',
    }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value || !this.startDate) return true;
        return value > this.startDate;
      },
      message: 'The renewal date must be after start date'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

// FIXED: Async pre-save hook (no next() parameter — compatible with Mongoose 8+)
subscriptionSchema.pre('save', async function () {
  // Auto-calculate renewalDate if not set
  if (!this.renewalDate && this.startDate && this.frequency) {
    const unitMap = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
      yearly: 'year'
    };
    const unit = unitMap[this.frequency.toLowerCase()];
    if (unit) {
      this.renewalDate = dayjs(this.startDate).add(1, unit).toDate();
    }
  }

  // Auto-expire if renewal date passed
  if (this.renewalDate && dayjs(this.renewalDate).isBefore(dayjs(), 'day')) {
    this.status = 'expired';
  }
});

// Index for renewal queries
subscriptionSchema.index({ renewalDate: 1 });

// Virtual days to renewal
subscriptionSchema.virtual('daysToRenewal').get(function () {
  if (!this.renewalDate) return null;
  return dayjs(this.renewalDate).diff(dayjs(), 'day');
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;