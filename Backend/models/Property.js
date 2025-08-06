const mongoose = require('mongoose');

const roomTaskSchema = new mongoose.Schema({
  roomType: {
    type: String,
    enum: ['bedroom', 'bathroom', 'kitchen', 'living_room', 'dining_room', 'office', 'laundry', 'other'],
    required: true
  },
  tasks: [{
    description: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    specialNotes: String,
    estimatedTime: String
  }],
  specialInstructions: [String],
  fragileItems: [String]
}, { _id: true });

const propertySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'office'],
    required: true
  },
  rooms: {
    type: Number,
    required: true,
    min: 1
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1
  },
  squareFootage: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  manual: {
    title: {
      type: String,
      default: 'Live Cleaning & Maintenance Manual'
    },
    content: {
      type: String,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  roomTasks: [roomTaskSchema],
  instructions: {
    type: String,
    trim: true
  },
  specialRequirements: [{
    type: String,
    trim: true
  }],
  owner: {
    name: String,
    email: String,
    phone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
propertySchema.index({ address: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ propertyId: 1 });

module.exports = mongoose.model('Property', propertySchema); 