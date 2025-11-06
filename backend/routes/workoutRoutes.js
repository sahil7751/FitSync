/**
 * Workout Routes
 * Handles CRUD operations for workout entries
 */

const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, date, duration, intensity, caloriesBurned, description, sets, reps, distance } = req.body;

    const workout = await Workout.create({
      userId: req.user._id,
      name,
      type,
      date: date || Date.now(),
      duration,
      intensity,
      caloriesBurned,
      description,
      sets,
      reps,
      distance,
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workouts
// @desc    Get all workouts for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let query = { userId: req.user._id };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by workout type if provided
    if (type) {
      query.type = type;
    }

    const workouts = await Workout.find(query).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get a single workout by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if workout belongs to user
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if workout belongs to user
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    workout.name = req.body.name || workout.name;
    workout.type = req.body.type || workout.type;
    workout.date = req.body.date || workout.date;
    workout.duration = req.body.duration !== undefined ? req.body.duration : workout.duration;
    workout.intensity = req.body.intensity || workout.intensity;
    workout.caloriesBurned = req.body.caloriesBurned !== undefined ? req.body.caloriesBurned : workout.caloriesBurned;
    workout.description = req.body.description || workout.description;
    workout.sets = req.body.sets !== undefined ? req.body.sets : workout.sets;
    workout.reps = req.body.reps !== undefined ? req.body.reps : workout.reps;
    workout.distance = req.body.distance !== undefined ? req.body.distance : workout.distance;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if workout belongs to user
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await workout.deleteOne();
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workouts/stats/summary
// @desc    Get workout statistics for the user
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

    const workouts = await Workout.find(query);

    const stats = {
      totalWorkouts: workouts.length,
      totalDuration: workouts.reduce((sum, workout) => sum + workout.duration, 0),
      totalCaloriesBurned: workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0),
      totalDistance: workouts.reduce((sum, workout) => sum + (workout.distance || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
