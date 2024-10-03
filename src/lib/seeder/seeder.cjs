const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const { Schema } = mongoose;

let isConnected = false;
async function dbConnect() {
    if (isConnected) {
      console.log('Already connected to the database');
      return;
    }
  
    try {
      const db = await mongoose.connect(process.env.MONGODB_URI);
  
      isConnected = db.connections[0].readyState === 1; 
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Database connection failed');
    }
  }

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true},
    lastName:{ type: String, required: true},
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    remainingAttempts: { type: Number, default: 2 },
    createdAt: { type: Date, default: Date.now },
  });
const User = mongoose.models.User || mongoose.model('User', userSchema);
  
const seedAdmin = async () => {
  try {
    // Connect to the database
    await dbConnect();

    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Hash the password for the admin
    const passwordHash = await bcrypt.hash('admin-password', 10);

    // Create the admin user
    const newAdmin = new User({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash, // Store the hashed password
      role: 'admin', // Assign the admin role
      remainingAttempts: 2, // Set default remaining attempts
    });

    // Save the admin user to the database
    await newAdmin.save();
    console.log('Admin user seeded successfully!');

  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Run the seeder
seedAdmin();
