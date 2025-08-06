const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['before', 'during', 'after'],
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  isUploaded: {
    type: Boolean,
    default: true
  },
  localPath: String,
  tags: [String],
  notes: String,
  voiceNotes: String
}, { _id: true });

const issueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['stain', 'crack', 'weed', 'damage', 'maintenance', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  location: String,
  notes: String,
  voiceNotes: String,
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date
}, { timestamps: true });

const aiFeedbackSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  feedback: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  suggestions: [String],
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'needs_followup'],
    default: 'pending'
  },
  estimatedTime: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  instructions: String,
  scheduledTime: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  photos: [photoSchema],
  issues: [issueSchema],
  aiFeedback: [aiFeedbackSchema],
  startedAt: Date,
  completedAt: Date,
  actualTime: String,
  notes: String
}, {
  timestamps: true
});

// Indexes for efficient queries
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ property: 1 });
taskSchema.index({ scheduledTime: 1 });

// Virtual for progress calculation
taskSchema.virtual('progress').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'in_progress') return 50;
  if (this.status === 'needs_followup') return 75;
  return 0;
});

// Ensure virtual fields are serialized
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema); 