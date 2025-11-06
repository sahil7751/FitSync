/**
 * Seed Data Script
 * Populates the database with sample users, meals, and workouts for testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Meal = require('./models/Meal');
const Workout = require('./models/Workout');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    email: 'admin@fitsync.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 75,
    goal: 'maintenance',
    activityLevel: 'moderate',
  },
  {
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user',
    age: 28,
    gender: 'male',
    height: 180,
    weight: 85,
    goal: 'weight_loss',
    activityLevel: 'active',
  },
  {
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    role: 'user',
    age: 25,
    gender: 'female',
    height: 165,
    weight: 60,
    goal: 'muscle_gain',
    activityLevel: 'very_active',
  },
  {
    email: 'mike@example.com',
    password: 'password123',
    name: 'Mike Johnson',
    role: 'user',
    age: 35,
    gender: 'male',
    height: 175,
    weight: 90,
    goal: 'weight_loss',
    activityLevel: 'moderate',
  },
];

const getMeals = (userId) => [
  {
    userId,
    name: 'Oatmeal with Berries',
    mealType: 'breakfast',
    calories: 350,
    protein: 12,
    carbs: 55,
    fats: 8,
    description: 'Healthy breakfast with fresh berries',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    name: 'Grilled Chicken Salad',
    mealType: 'lunch',
    calories: 400,
    protein: 45,
    carbs: 25,
    fats: 12,
    description: 'Mixed greens with grilled chicken breast',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    name: 'Salmon with Vegetables',
    mealType: 'dinner',
    calories: 550,
    protein: 40,
    carbs: 35,
    fats: 25,
    description: 'Baked salmon with roasted vegetables',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    name: 'Protein Smoothie',
    mealType: 'snack',
    calories: 250,
    protein: 30,
    carbs: 25,
    fats: 5,
    description: 'Banana and protein powder smoothie',
    date: new Date(),
  },
];

const getWorkouts = (userId) => [
  {
    userId,
    name: 'Morning Run',
    type: 'cardio',
    duration: 30,
    intensity: 'moderate',
    caloriesBurned: 300,
    distance: 5,
    description: '5K morning run',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    name: 'Upper Body Workout',
    type: 'strength',
    duration: 45,
    intensity: 'high',
    caloriesBurned: 250,
    sets: 4,
    reps: 10,
    description: 'Chest and back workout',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    name: 'Yoga Session',
    type: 'flexibility',
    duration: 60,
    intensity: 'low',
    caloriesBurned: 150,
    description: 'Relaxing yoga for flexibility',
    date: new Date(),
  },
];

// Seed database
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Meal.deleteMany({});
    await Workout.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.email}`);
    }

    // Create meals for each user (skip admin)
    console.log('🍽️  Creating meals...');
    for (let i = 1; i < createdUsers.length; i++) {
      const meals = getMeals(createdUsers[i]._id);
      await Meal.insertMany(meals);
      console.log(`   ✓ Created ${meals.length} meals for ${createdUsers[i].name}`);
    }

    // Create workouts for each user (skip admin)
    console.log('🏋️  Creating workouts...');
    for (let i = 1; i < createdUsers.length; i++) {
      const workouts = getWorkouts(createdUsers[i]._id);
      await Workout.insertMany(workouts);
      console.log(`   ✓ Created ${workouts.length} workouts for ${createdUsers[i].name}`);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@fitsync.com / admin123');
    console.log('   User: john@example.com / password123');
    console.log('   User: jane@example.com / password123');
    console.log('   User: mike@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
