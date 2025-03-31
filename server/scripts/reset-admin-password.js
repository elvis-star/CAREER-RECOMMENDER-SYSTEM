// Script to reset admin password
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';
import readline from 'readline';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to reset admin password
const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Ask for admin email
    rl.question('Enter admin email: ', async (email) => {
      // Find admin user
      const admin = await User.findOne({ email, role: 'admin' });

      if (!admin) {
        console.error(`No admin user found with email ${email}`);
        rl.close();
        process.exit(1);
      }

      // Ask for new password
      rl.question('Enter new password: ', async (password) => {
        // Validate password
        if (password.length < 8) {
          console.error('Password must be at least 8 characters long');
          rl.close();
          process.exit(1);
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // Update admin password
        admin.password = password;
        await admin.save();

        console.log(`Password reset successfully for admin: ${admin.email}`);
        rl.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    rl.close();
    process.exit(1);
  }
};

// Run the function
resetAdminPassword();
