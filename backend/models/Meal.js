/**
 * Meal Model
 * Schema for storing meal entries and nutritional information
 */

const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    // Reference to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Meal details
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: [true, 'Meal type is required'],
    },
    
    // Date and time
    date: {
      type: Date,
      default: Date.now,
    },
    
    // Nutritional information
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      default: 0,
      min: [0, 'Protein cannot be negative'],
    },
    carbs: {
      type: Number,
      default: 0,
      min: [0, 'Carbs cannot be negative'],
    },
    fats: {
      type: Number,
      default: 0,
      min: [0, 'Fats cannot be negative'],
    },
    
    // Additional details
    description: {
      type: String,
      trim: true,
    },
    portion: {
      type: String,
      default: '1 serving',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
mealSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Meal', mealSchema);
