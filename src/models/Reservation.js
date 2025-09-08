// src/models/Reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Indian mobile number validation (10 digits starting with 6-9)
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit mobile number starting with 6-9'
    }
  },
  date: {
    type: String, // Store as YYYY-MM-DD string for easier querying
    required: [true, 'Date is required'],
    validate: {
      validator: function(v) {
        // Check if date is in YYYY-MM-DD format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
        const inputDate = new Date(v);
        return !isNaN(inputDate.getTime());
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    validate: {
      validator: function(v) {
        // Check if time is in HH:MM format (24-hour)
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Please enter time in HH:MM format (24-hour)'
    }
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest is required'],
    max: [20, 'Maximum 20 guests allowed per reservation']
  },
  specialRequest: {
    type: String,
    default: '',
    maxlength: [500, 'Special request cannot exceed 500 characters'],
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Status must be one of: pending, confirmed, cancelled, completed'
    },
    default: 'pending',
    index: true
  },
  otp: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^\d{6}$/.test(v);
      },
      message: 'OTP must be 6 digits'
    }
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  // Additional useful fields
  customerEmail: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  tableAssigned: {
    type: String,
    default: '',
    maxlength: [20, 'Table assignment cannot exceed 20 characters']
  },
  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'reservations' // Explicit collection name
});

// REMOVED UNIQUE INDEX - This was causing the 500 error
// Instead, we'll handle duplicates in the application logic

// Non-unique indexes for better query performance
reservationSchema.index({ mobile: 1, date: 1, time: 1 }, { name: 'reservation_lookup' });
reservationSchema.index({ date: 1, time: 1 }, { name: 'date_time_lookup' });
reservationSchema.index({ createdAt: -1 }, { name: 'creation_time_desc' });
reservationSchema.index({ status: 1, date: 1 }, { name: 'status_date_lookup' });
reservationSchema.index({ isVerified: 1, status: 1 }, { name: 'verified_status_lookup' });

// Virtual field for formatted date (readable format)
reservationSchema.virtual('formattedDate').get(function() {
  if (this.date) {
    try {
      const date = new Date(this.date);
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return this.date;
    }
  }
  return '';
});

// Virtual field for formatted time (12-hour format)
reservationSchema.virtual('formattedTime').get(function() {
  if (this.time) {
    try {
      const [hours, minutes] = this.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return this.time;
    }
  }
  return '';
});

// Pre-save middleware to clean and validate data
reservationSchema.pre('save', function(next) {
  // Clean mobile number (remove any non-digits)
  if (this.mobile) {
    this.mobile = this.mobile.replace(/\D/g, '');
  }
  
  // Ensure status has a default value
  if (!this.status) {
    this.status = 'pending';
  }
  
  next();
});

// Instance methods
reservationSchema.methods.markAsConfirmed = function() {
  this.status = 'confirmed';
  this.isVerified = true;
  return this.save();
};

reservationSchema.methods.markAsCancelled = function() {
  this.status = 'cancelled';
  return this.save();
};

reservationSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  return this.save();
};

reservationSchema.methods.isOTPExpired = function() {
  return !this.otpExpiry || new Date() > this.otpExpiry;
};

reservationSchema.methods.verifyOTP = function(inputOTP) {
  if (this.isOTPExpired()) {
    return { success: false, message: 'OTP has expired' };
  }
  
  if (this.otp !== inputOTP) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  return { success: true, message: 'OTP verified successfully' };
};

// Static methods for common queries
reservationSchema.statics.findByDate = function(date) {
  return this.find({ 
    date, 
    isVerified: true 
  }).sort({ time: 1 });
};

reservationSchema.statics.findByMobile = function(mobile) {
  const cleanMobile = mobile.replace(/\D/g, '');
  return this.find({ 
    mobile: cleanMobile,
    isVerified: true 
  }).sort({ createdAt: -1 });
};

reservationSchema.statics.getTodayReservations = function() {
  const today = new Date().toISOString().split('T')[0];
  return this.find({ 
    date: today,
    isVerified: true 
  }).sort({ time: 1 });
};

reservationSchema.statics.getUpcomingReservations = function(days = 7) {
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  const futureDateString = futureDate.toISOString().split('T')[0];
  
  return this.find({
    date: { $gte: today, $lte: futureDateString },
    isVerified: true
  }).sort({ date: 1, time: 1 });
};

// Static method to check for duplicates (used in API)
reservationSchema.statics.findExistingReservation = function(mobile, date, time, excludeId = null) {
  const cleanMobile = mobile.replace(/\D/g, '');
  const query = {
    mobile: cleanMobile,
    date,
    time
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  return this.findOne(query);
};

// Ensure virtual fields are included when converting to JSON
reservationSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive fields from JSON output
    delete ret.otp;
    delete ret.otpExpiry;
    delete ret.__v;
    return ret;
  }
});

reservationSchema.set('toObject', { virtuals: true });

// Prevent model re-compilation in development
let Reservation;
try {
  Reservation = mongoose.model('Reservation');
} catch (error) {
  Reservation = mongoose.model('Reservation', reservationSchema);
}

export default Reservation;