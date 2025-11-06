/**
 * Meal Routes
 * Handles CRUD operations for meal entries
 */

const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/meals
// @desc    Create a new meal
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, mealType, date, calories, protein, carbs, fats, description, portion } = req.body;

    const meal = await Meal.create({
      userId: req.user._id,
      name,
      mealType,
      date: date || Date.now(),
      calories,
      protein,
      carbs,
      fats,
      description,
      portion,
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/meals
// @desc    Get all meals for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, mealType } = req.query;
    
    let query = { userId: req.user._id };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by meal type if provided
    if (mealType) {
      query.mealType = mealType;
    }

    const meals = await Meal.find(query).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/meals/:id
// @desc    Get a single meal by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/meals/:id
// @desc    Update a meal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    meal.name = req.body.name || meal.name;
    meal.mealType = req.body.mealType || meal.mealType;
    meal.date = req.body.date || meal.date;
    meal.calories = req.body.calories !== undefined ? req.body.calories : meal.calories;
    meal.protein = req.body.protein !== undefined ? req.body.protein : meal.protein;
    meal.carbs = req.body.carbs !== undefined ? req.body.carbs : meal.carbs;
    meal.fats = req.body.fats !== undefined ? req.body.fats : meal.fats;
    meal.description = req.body.description || meal.description;
    meal.portion = req.body.portion || meal.portion;

    const updatedMeal = await meal.save();
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await meal.deleteOne();
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/meals/stats/summary
// @desc    Get meal statistics for the user
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const meals = await Meal.find(query);

    const stats = {
      totalMeals: meals.length,
      totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      totalProtein: meals.reduce((sum, meal) => sum + meal.protein, 0),
      totalCarbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
      totalFats: meals.reduce((sum, meal) => sum + meal.fats, 0),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
