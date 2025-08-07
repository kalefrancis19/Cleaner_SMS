const express = require('express');
const { auth } = require('../middleware/auth');
const Task = require('../models/Task');
const Property = require('../models/Property');

const router = express.Router();

// Public endpoint for AdminWeb to get all tasks (no auth required)
router.get('/admin', async (req, res) => {
  try {
    const { property } = req.query;
    let query = {};
    
    if (property) {
      query.property = property;
    }
    
    const tasks = await Task.find(query)
      .populate('property', 'name address type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks: tasks
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate('property', 'name address type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.userId
    }).populate('property', 'name address type');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'completed', 'needs_followup'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        assignedTo: req.user.userId
      },
      {
        status,
        ...(status === 'in_progress' && { startedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { new: true }
    ).populate('property', 'name address type');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add photo to task
const addPhoto = async (req, res) => {
  try {
    const { photoUrl, type, notes } = req.body;
    const validTypes = ['before', 'during', 'after'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid photo type'
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.photos.push({
      url: photoUrl,
      type,
      notes
    });

    await task.save();

    res.json({
      success: true,
      message: 'Photo added successfully',
      data: task
    });
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add issue to task
const addIssue = async (req, res) => {
  try {
    const { type, description, severity, location, notes } = req.body;
    const validTypes = ['stain', 'crack', 'weed', 'damage', 'maintenance', 'other'];
    const validSeverities = ['low', 'medium', 'high'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue type'
      });
    }

    if (!validSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid severity level'
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.issues.push({
      type,
      description,
      severity,
      location,
      notes
    });

    await task.save();

    res.json({
      success: true,
      message: 'Issue added successfully',
      data: task
    });
  } catch (error) {
    console.error('Add issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update task notes
const updateTaskNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        assignedTo: req.user.userId
      },
      { notes },
      { new: true }
    ).populate('property', 'name address type');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task notes updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: { assignedTo: req.user.userId }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments({ assignedTo: req.user.userId });
    const completedTasks = await Task.countDocuments({ 
      assignedTo: req.user.userId, 
      status: 'completed' 
    });

    res.json({
      success: true,
      data: {
        stats,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get property details with manual and room tasks
const getPropertyDetails = async (req, res) => {
  try {
    const Property = require('../models/Property');
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update room task completion status
const updateRoomTaskStatus = async (req, res) => {
  try {
    const Property = require('../models/Property');
    const { roomType, taskIndex, isCompleted } = req.body;

    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const roomTask = property.roomTasks.find(rt => rt.roomType === roomType);
    if (!roomTask || !roomTask.tasks[taskIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Room task not found'
      });
    }

    roomTask.tasks[taskIndex].isCompleted = isCompleted;
    await property.save();

    res.json({
      success: true,
      message: 'Room task status updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Update room task status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Routes
router.get('/', auth, getTasks);
router.get('/stats', auth, getTaskStats);
router.get('/:id', auth, getTaskById);
router.get('/property/:propertyId', auth, getPropertyDetails);
router.patch('/:id/status', auth, updateTaskStatus);
router.patch('/property/:propertyId/room-task', auth, updateRoomTaskStatus);
router.post('/:id/photos', auth, addPhoto);
router.post('/:id/issues', auth, addIssue);
router.patch('/:id/notes', auth, updateTaskNotes);

module.exports = router; 