import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Career from '../models/Career.js';
import Institution from '../models/Institution.js';
import Activity from '../models/Activity.js';
import users from './_data/users.json' assert { type: 'json' };
import careers from './_data/careers.json' assert { type: 'json' };
import institutions from './_data/institutions.json' assert { type: 'json' };
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Career.deleteMany();
    await Institution.deleteMany();
    await Activity.deleteMany();

    console.log('Data cleared...'.yellow);

    // Create default super admin if ADMIN credentials are provided in env
    if (process.env.DEFAULT_ADMIN_EMAIL && process.env.DEFAULT_ADMIN_PASSWORD) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASSWORD,
        salt
      );

      const superAdmin = await User.create({
        name: 'System Administrator',
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        userType: 'admin',
        emailVerified: true,
      });

      console.log(`Default admin created: ${superAdmin.email}`.green);
    }

    // Import users with hashed passwords
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    await User.insertMany(createdUsers);
    await Career.insertMany(careers);
    await Institution.insertMany(institutions);

    console.log('Data imported...'.green);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Career.deleteMany();
    await Institution.deleteMany();
    await Activity.deleteMany();

    console.log('Data destroyed...'.red);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data'.yellow);
  process.exit();
}
