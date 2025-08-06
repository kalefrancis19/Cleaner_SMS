const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      properties: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    res.json({
      success: true,
      property: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
});

// Create new property
router.post('/', async (req, res) => {
  try {
    const {
      propertyId,
      name,
      address,
      type,
      rooms,
      bathrooms,
      squareFootage,
      estimatedTime,
      manual,
      roomTasks,
      instructions,
      specialRequirements,
      owner
    } = req.body;

    // Validate required fields
    if (!propertyId || !name || !address || !type || !rooms || !bathrooms || !squareFootage || !estimatedTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if propertyId already exists
    const existingProperty = await Property.findOne({ propertyId });
    if (existingProperty) {
      return res.status(400).json({
        success: false,
        message: 'Property ID already exists'
      });
    }

    const property = new Property({
      propertyId,
      name,
      address,
      type,
      rooms,
      bathrooms,
      squareFootage,
      estimatedTime,
      manual: manual || {
        title: 'Live Cleaning & Maintenance Manual',
        content: `Live Cleaning & Maintenance Manual\n${address}\nProperty Overview\n- Property ID: ${propertyId}\n- Type: ${type}\n- Square Footage: ${squareFootage} sq ft\n- Estimated Time: ${estimatedTime}`
      },
      roomTasks: roomTasks || [],
      instructions,
      specialRequirements,
      owner,
      isActive: true
    });

    const savedProperty = await property.save();
    res.status(201).json({
      success: true,
      property: savedProperty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
});

// Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        property[key] = req.body[key];
      }
    });

    const updatedProperty = await property.save();
    res.json({
      success: true,
      property: updatedProperty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
});

// Get property manual
router.get('/:id/manual', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      manual: property.manual
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property manual',
      error: error.message
    });
  }
});

// Update property manual
router.patch('/:id/manual', async (req, res) => {
  try {
    const { manual } = req.body;
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (!manual || !manual.title || !manual.content) {
      return res.status(400).json({
        success: false,
        message: 'Manual title and content are required'
      });
    }

    property.manual = {
      title: manual.title,
      content: manual.content,
      lastUpdated: new Date()
    };

    const updatedProperty = await property.save();
    res.json({
      success: true,
      property: updatedProperty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property manual',
      error: error.message
    });
  }
});

// Toggle property active status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.isActive = !property.isActive;
    const updatedProperty = await property.save();
    
    res.json({
      success: true,
      property: updatedProperty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling property status',
      error: error.message
    });
  }
});

module.exports = router; 