const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const net = require('net');
require('dotenv').config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const propertyRoutes = require('./routes/properties');

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PropertySanta Cleaner API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to check properties
app.get('/debug/properties', async (req, res) => {
  try {
    const Property = require('./models/Property');
    const properties = await Property.find({});
    res.json({
      success: true,
      count: properties.length,
      properties: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/properties', propertyRoutes);

// Function to find available port
const findAvailablePort = async (startPort) => {
  const port = parseInt(startPort);
  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid port number: ${startPort}`);
  }
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(port, () => {
      const { port: actualPort } = server.address();
      server.close(() => resolve(actualPort));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        findAvailablePort(port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Function to update frontend environment files
const updateFrontendEnv = (port) => {
  const apiUrl = `http://localhost:${port}/api`;
  
  // Update both frontend environment files
  const frontendPaths = [
    path.join(__dirname, '..', '.env.local'),           // Cleaner App
    path.join(__dirname, '..', 'AdminWeb', '.env.local') // AdminWeb
  ];

  frontendPaths.forEach((envPath) => {
    try {
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      const apiUrlLine = `NEXT_PUBLIC_API_URL=${apiUrl}`;

      if (envContent.includes('NEXT_PUBLIC_API_URL=')) {
        envContent = envContent.replace(
          /NEXT_PUBLIC_API_URL=.*/g,
          apiUrlLine
        );
      } else {
        envContent += `\n${apiUrlLine}`;
      }

      fs.writeFileSync(envPath, envContent);
      console.log(`✅ Updated ${path.basename(path.dirname(envPath))} .env.local with API URL: ${apiUrl}`);
    } catch (error) {
      console.error(`❌ Failed to update ${path.basename(path.dirname(envPath))} environment:`, error);
    }
  });
};

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize database with sample data
const initializeDatabase = async () => {
  try {
    console.log('🔄 Starting database initialization...');
    const User = require('./models/User');
    const Property = require('./models/Property');
    const Task = require('./models/Task');

    // Check if sample data already exists
    const existingCleaner = await User.findOne({ email: 'elite@gmail.com' });
    const existingCustomer = await User.findOne({ email: 'john.smith@email.com' });
    const existingAdmin = await User.findOne({ email: 'admin@propertysanta.com' });
    
    console.log('🔍 Existing users found:', {
      cleaner: !!existingCleaner,
      customer: !!existingCustomer,
      admin: !!existingAdmin
    });
    
    let cleaner, customer, admin;
    
    // Create sample cleaner if it doesn't exist
    if (!existingCleaner) {
      console.log('👤 Creating sample cleaner...');
      cleaner = new User({
        name: 'elite cleaner',
        email: 'elite@gmail.com',
        password: 'password',
        phone: '+1 (555) 123-4567',
        role: 'cleaner',
        rating: 4.8,
        avatar: null,
        specialties: ['Deep Cleaning', 'Kitchen Sanitization', 'Bathroom Cleaning', 'Office Cleaning'],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        lastLogin: new Date()
      });
      await cleaner.save();
      console.log('✅ Sample cleaner created');
    } else {
      cleaner = existingCleaner;
      console.log('✅ Using existing cleaner');
    }
    
    // Create sample customer if it doesn't exist
    if (!existingCustomer) {
      console.log('👤 Creating sample customer...');
      customer = new User({
        name: 'John Smith',
        email: 'john.smith@email.com',
        password: 'password',
        phone: '+1 (555) 987-6543',
        role: 'customer',
        rating: 0,
        avatar: null,
        specialties: [],
        availability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        },
        lastLogin: new Date()
      });
      await customer.save();
      console.log('✅ Sample customer created');
    } else {
      customer = existingCustomer;
      console.log('✅ Using existing customer');
    }
    
    // Create sample admin if it doesn't exist
    if (!existingAdmin) {
      console.log('👤 Creating sample admin...');
      admin = new User({
        name: 'PropertySanta Admin',
        email: 'admin@propertysanta.com',
        password: 'admin123',
        phone: '+1 (555) 000-0000',
        role: 'admin',
        rating: 0,
        avatar: null,
        specialties: [],
        availability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        },
        lastLogin: new Date()
      });
      await admin.save();
      console.log('✅ Sample admin created');
    } else {
      admin = existingAdmin;
      console.log('✅ Using existing admin');
    }

    // Check if properties already exist
    const existingProperties = await Property.find({});
    console.log('🔍 Existing properties found:', existingProperties.length);
    
    if (existingProperties.length === 0) {
      console.log('🔄 Creating sample properties...');
    } else {
      console.log('✅ Using existing properties');
      return; // Skip creation if properties already exist
    }

    // Create sample properties
    console.log('🏠 Creating sample properties...');
    const properties = [
      {
        propertyId: 'EO-1208-RDU',
        name: 'Enchanted Oaks House',
        address: '1208 Enchanted Oaks Drive, Raleigh, NC 27606',
        type: 'house',
        rooms: 3,
        bathrooms: 2,
        squareFootage: 1945,
        estimatedTime: '2 hours',
        manual: {
          title: 'Live Cleaning & Maintenance Manual',
          content: `Live Cleaning & Maintenance Manual
1208 Enchanted Oaks Drive, Raleigh, NC 27606
Property Overview
- Property ID: EO-1208-RDU
- Type: Bedroom, Bathroom
- Square Footage: 1,945 sq ft
- time: 2hours

Bedrooms
- make the bed
- clean the floor
- Do not move ceramic lamp on master dresser (fragile)

Bathrooms
- Use glass cleaner on mirror 
- Scrub grout weekly with baking soda mix
- Refill soap, TP, hand towels`,
          lastUpdated: new Date()
        },
        roomTasks: [
          {
            roomType: 'bedroom',
            tasks: [
              {
                description: 'Make the bed',
                isCompleted: false,
                estimatedTime: '10 minutes'
              },
              {
                description: 'Clean the floor',
                isCompleted: false,
                estimatedTime: '15 minutes'
              }
            ],
            specialInstructions: ['Do not move ceramic lamp on master dresser (fragile)'],
            fragileItems: ['Ceramic lamp on master dresser']
          },
          {
            roomType: 'bathroom',
            tasks: [
              {
                description: 'Use glass cleaner on mirror',
                isCompleted: false,
                estimatedTime: '5 minutes'
              },
              {
                description: 'Scrub grout weekly with baking soda mix',
                isCompleted: false,
                estimatedTime: '20 minutes'
              },
              {
                description: 'Refill soap, TP, hand towels',
                isCompleted: false,
                estimatedTime: '5 minutes'
              }
            ],
            specialInstructions: ['Scrub grout weekly with baking soda mix'],
            fragileItems: []
          }
        ],
        instructions: 'Focus on kitchen and bathroom',
        specialRequirements: ['Pet-friendly cleaning', 'Eco-friendly products'],
        owner: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        coordinates: {
          latitude: 35.7796,
          longitude: -78.6382
        }
      },
      {
        propertyId: 'DT-123-MAIN',
        name: 'Downtown Apartment',
        address: '123 Main St, Downtown',
        type: 'apartment',
        rooms: 2,
        bathrooms: 1,
        squareFootage: 1200,
        estimatedTime: '1.5 hours',
        manual: {
          title: 'Live Cleaning & Maintenance Manual',
          content: `Live Cleaning & Maintenance Manual
123 Main St, Downtown
Property Overview
- Property ID: DT-123-MAIN
- Type: Apartment
- Square Footage: 1,200 sq ft
- time: 1.5 hours

Living Room
- Dust all surfaces
- Vacuum carpets
- Clean windows

Kitchen
- Clean countertops
- Wipe down appliances
- Empty trash

Bathroom
- Clean toilet and sink
- Wipe down shower
- Restock supplies`,
          lastUpdated: new Date()
        },
        roomTasks: [
          {
            roomType: 'living_room',
            tasks: [
              {
                description: 'Dust all surfaces',
                isCompleted: false,
                estimatedTime: '10 minutes'
              },
              {
                description: 'Vacuum carpets',
                isCompleted: false,
                estimatedTime: '15 minutes'
              },
              {
                description: 'Clean windows',
                isCompleted: false,
                estimatedTime: '10 minutes'
              }
            ],
            specialInstructions: [],
            fragileItems: []
          },
          {
            roomType: 'kitchen',
            tasks: [
              {
                description: 'Clean countertops',
                isCompleted: false,
                estimatedTime: '10 minutes'
              },
              {
                description: 'Wipe down appliances',
                isCompleted: false,
                estimatedTime: '15 minutes'
              },
              {
                description: 'Empty trash',
                isCompleted: false,
                estimatedTime: '5 minutes'
              }
            ],
            specialInstructions: [],
            fragileItems: []
          },
          {
            roomType: 'bathroom',
            tasks: [
              {
                description: 'Clean toilet and sink',
                isCompleted: false,
                estimatedTime: '10 minutes'
              },
              {
                description: 'Wipe down shower',
                isCompleted: false,
                estimatedTime: '10 minutes'
              },
              {
                description: 'Restock supplies',
                isCompleted: false,
                estimatedTime: '5 minutes'
              }
            ],
            specialInstructions: [],
            fragileItems: []
          }
        ],
        instructions: 'Focus on kitchen and bathroom',
        specialRequirements: ['Pet-friendly cleaning', 'Eco-friendly products'],
        owner: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 456-7890'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      }
    ];

    console.log('📝 Inserting properties...');
    const savedProperties = await Property.insertMany(properties);
    console.log('✅ Properties created:', savedProperties.length);

    // Create sample tasks
    console.log('📋 Creating sample tasks...');
    const tasks = [
      {
        title: 'Kitchen Deep Clean',
        description: 'Deep clean kitchen including appliances, cabinets, and floors',
        property: savedProperties[0]._id,
        address: '1208 Enchanted Oaks Drive, Raleigh, NC 27606',
        status: 'pending',
        estimatedTime: '2 hours',
        priority: 'high',
        assignedTo: cleaner._id,
        instructions: 'Use eco-friendly cleaning products',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        photos: [],
        issues: [],
        aiFeedback: [],
        notes: 'Focus on grease removal from stovetop'
      },
      {
        title: 'Bathroom Sanitization',
        description: 'Sanitize bathroom including shower, toilet, and sink',
        property: savedProperties[0]._id,
        address: '1208 Enchanted Oaks Drive, Raleigh, NC 27606',
        status: 'in_progress',
        estimatedTime: '1.5 hours',
        priority: 'medium',
        assignedTo: cleaner._id,
        instructions: 'Pay special attention to grout lines',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
        photos: [],
        issues: [],
        aiFeedback: [],
        notes: 'Hard water stains on shower door need special attention'
      },
      {
        title: 'Living Room Cleaning',
        description: 'Clean living room including dusting, vacuuming, and organizing',
        property: savedProperties[1]._id,
        address: '123 Main St, Downtown',
        status: 'completed',
        estimatedTime: '1 hour',
        priority: 'low',
        assignedTo: cleaner._id,
        instructions: 'Move furniture for thorough cleaning',
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // Started 4 hours ago
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Completed 2 hours ago
        actualTime: '1.2 hours',
        photos: [],
        issues: [],
        aiFeedback: [],
        notes: 'All furniture moved and cleaned underneath'
      }
    ];

    await Task.insertMany(tasks);
    console.log('✅ Tasks created');

    console.log('✅ New sample data initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  await initializeDatabase();

  try {
    const availablePort = await findAvailablePort(PORT);

    app.listen(availablePort, () => {
      console.log(`🚀 Server running on port ${availablePort}`);
      console.log(`📱 API available at http://localhost:${availablePort}`);
      console.log(`🔗 Health check: http://localhost:${availablePort}/health`);

      updateFrontendEnv(availablePort);

      if (availablePort !== PORT) {
        console.log(`⚠️  Port ${PORT} was in use, using port ${availablePort} instead`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 