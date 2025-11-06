/**
 * Workout Model
 * Schema for storing workout sessions and exercise details
 */

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    // Reference to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Workout details
    name: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
      required: [true, 'Workout type is required'],
    },
    
    // Date and time
    date: {
      type: Date,
      default: Date.now,
    },
    
    // Duration and intensity
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },
    
    // Calories burned
    caloriesBurned: {
      type: Number,
      required: [true, 'Calories burned is required'],
      min: [0, 'Calories cannot be negative'],
    },
    
    // Additional details
    description: {
      type: String,
      trim: true,
    },
    sets: {
      type: Number,
      min: [0, 'Sets cannot be negative'],
    },
    reps: {
      type: Number,
      min: [0, 'Reps cannot be negative'],
    },
    distance: {
      type: Number, // in kilometers
      min: [0, 'Distance cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
