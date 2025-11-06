/**
 * Recommendation Routes
 * Provides personalized workout and meal recommendations based on user goals
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Workout recommendations database
const workoutRecommendations = {
  weight_loss: [
    { name: 'Running', type: 'cardio', duration: 30, caloriesBurned: 300, intensity: 'moderate', description: 'Great for burning calories and improving cardiovascular health' },
    { name: 'Cycling', type: 'cardio', duration: 45, caloriesBurned: 400, intensity: 'moderate', description: 'Low impact cardio that burns fat effectively' },
    { name: 'Swimming', type: 'cardio', duration: 30, caloriesBurned: 350, intensity: 'moderate', description: 'Full body workout with minimal joint stress' },
    { name: 'HIIT Training', type: 'cardio', duration: 20, caloriesBurned: 300, intensity: 'high', description: 'High intensity intervals for maximum calorie burn' },
    { name: 'Jump Rope', type: 'cardio', duration: 15, caloriesBurned: 200, intensity: 'high', description: 'Effective cardio that can be done anywhere' },
  ],
  weight_gain: [
    { name: 'Bench Press', type: 'strength', duration: 45, caloriesBurned: 200, intensity: 'high', description: 'Build upper body mass and strength', sets: 4, reps: 8 },
    { name: 'Squats', type: 'strength', duration: 45, caloriesBurned: 250, intensity: 'high', description: 'Essential for building leg mass', sets: 4, reps: 10 },
    { name: 'Deadlifts', type: 'strength', duration: 45, caloriesBurned: 300, intensity: 'high', description: 'Full body compound movement for mass', sets: 3, reps: 8 },
    { name: 'Pull-ups', type: 'strength', duration: 30, caloriesBurned: 150, intensity: 'moderate', description: 'Build back and arm strength', sets: 4, reps: 10 },
    { name: 'Shoulder Press', type: 'strength', duration: 30, caloriesBurned: 150, intensity: 'moderate', description: 'Develop shoulder mass and strength', sets: 4, reps: 10 },
  ],
  muscle_gain: [
    { name: 'Weight Training', type: 'strength', duration: 60, caloriesBurned: 250, intensity: 'high', description: 'Progressive overload for muscle growth', sets: 4, reps: 8 },
    { name: 'Compound Lifts', type: 'strength', duration: 60, caloriesBurned: 300, intensity: 'high', description: 'Multiple muscle groups for maximum growth', sets: 5, reps: 5 },
    { name: 'Hypertrophy Training', type: 'strength', duration: 50, caloriesBurned: 200, intensity: 'moderate', description: 'Moderate weight, high volume for size', sets: 4, reps: 12 },
    { name: 'Push-Pull Split', type: 'strength', duration: 55, caloriesBurned: 250, intensity: 'high', description: 'Balanced training for all muscle groups', sets: 4, reps: 10 },
    { name: 'Leg Day', type: 'strength', duration: 60, caloriesBurned: 300, intensity: 'high', description: 'Focus on lower body development', sets: 4, reps: 10 },
  ],
  maintenance: [
    { name: 'Jogging', type: 'cardio', duration: 30, caloriesBurned: 250, intensity: 'moderate', description: 'Maintain cardiovascular fitness' },
    { name: 'Bodyweight Circuit', type: 'strength', duration: 30, caloriesBurned: 200, intensity: 'moderate', description: 'Full body maintenance routine' },
    { name: 'Yoga', type: 'flexibility', duration: 45, caloriesBurned: 150, intensity: 'low', description: 'Improve flexibility and mindfulness' },
    { name: 'Walking', type: 'cardio', duration: 45, caloriesBurned: 150, intensity: 'low', description: 'Low impact daily activity' },
    { name: 'Light Resistance Training', type: 'strength', duration: 40, caloriesBurned: 180, intensity: 'moderate', description: 'Maintain muscle tone', sets: 3, reps: 12 },
  ],
  endurance: [
    { name: 'Long Distance Running', type: 'cardio', duration: 60, caloriesBurned: 600, intensity: 'moderate', description: 'Build cardiovascular endurance', distance: 10 },
    { name: 'Cycling', type: 'cardio', duration: 90, caloriesBurned: 700, intensity: 'moderate', description: 'Low impact endurance training', distance: 30 },
    { name: 'Swimming Laps', type: 'cardio', duration: 45, caloriesBurned: 400, intensity: 'moderate', description: 'Full body endurance workout' },
    { name: 'Rowing', type: 'cardio', duration: 40, caloriesBurned: 400, intensity: 'moderate', description: 'Full body cardiovascular endurance' },
    { name: 'Trail Running', type: 'cardio', duration: 50, caloriesBurned: 500, intensity: 'moderate', description: 'Varied terrain for endurance', distance: 8 },
  ],
};

// Meal recommendations database
const mealRecommendations = {
  weight_loss: [
    { name: 'Grilled Chicken Salad', mealType: 'lunch', calories: 350, protein: 40, carbs: 20, fats: 10, description: 'High protein, low calorie meal' },
    { name: 'Greek Yogurt with Berries', mealType: 'breakfast', calories: 200, protein: 15, carbs: 25, fats: 5, description: 'Light, protein-rich breakfast' },
    { name: 'Vegetable Stir-fry', mealType: 'dinner', calories: 300, protein: 15, carbs: 35, fats: 12, description: 'Low calorie, nutrient dense' },
    { name: 'Protein Smoothie', mealType: 'snack', calories: 180, protein: 20, carbs: 15, fats: 5, description: 'Quick protein boost' },
    { name: 'Baked Salmon with Veggies', mealType: 'dinner', calories: 400, protein: 35, carbs: 20, fats: 18, description: 'Omega-3 rich, filling meal' },
  ],
  weight_gain: [
    { name: 'Protein Pancakes', mealType: 'breakfast', calories: 550, protein: 35, carbs: 60, fats: 15, description: 'High calorie breakfast for gains' },
    { name: 'Beef and Rice Bowl', mealType: 'lunch', calories: 700, protein: 45, carbs: 80, fats: 20, description: 'Mass building meal' },
    { name: 'Pasta with Meat Sauce', mealType: 'dinner', calories: 800, protein: 40, carbs: 95, fats: 25, description: 'Calorie dense dinner' },
    { name: 'Peanut Butter Sandwich', mealType: 'snack', calories: 400, protein: 15, carbs: 40, fats: 18, description: 'Quick calorie boost' },
    { name: 'Mass Gainer Shake', mealType: 'snack', calories: 600, protein: 50, carbs: 75, fats: 10, description: 'High calorie protein shake' },
  ],
  muscle_gain: [
    { name: 'Egg White Omelette', mealType: 'breakfast', calories: 300, protein: 35, carbs: 15, fats: 8, description: 'Lean protein breakfast' },
    { name: 'Chicken and Sweet Potato', mealType: 'lunch', calories: 500, protein: 45, carbs: 50, fats: 10, description: 'Balanced muscle building meal' },
    { name: 'Steak with Quinoa', mealType: 'dinner', calories: 650, protein: 50, carbs: 45, fats: 25, description: 'High protein dinner' },
    { name: 'Cottage Cheese Bowl', mealType: 'snack', calories: 200, protein: 25, carbs: 10, fats: 5, description: 'Casein protein snack' },
    { name: 'Tuna Salad', mealType: 'lunch', calories: 350, protein: 40, carbs: 20, fats: 12, description: 'Lean protein source' },
  ],
  maintenance: [
    { name: 'Balanced Breakfast Bowl', mealType: 'breakfast', calories: 400, protein: 20, carbs: 50, fats: 12, description: 'Well-rounded breakfast' },
    { name: 'Turkey Sandwich', mealType: 'lunch', calories: 450, protein: 30, carbs: 45, fats: 15, description: 'Balanced midday meal' },
    { name: 'Grilled Fish with Rice', mealType: 'dinner', calories: 500, protein: 35, carbs: 55, fats: 15, description: 'Healthy dinner option' },
    { name: 'Mixed Nuts', mealType: 'snack', calories: 200, protein: 8, carbs: 12, fats: 16, description: 'Nutrient dense snack' },
    { name: 'Vegetable Soup', mealType: 'lunch', calories: 250, protein: 10, carbs: 35, fats: 8, description: 'Light, nutritious meal' },
  ],
  endurance: [
    { name: 'Oatmeal with Banana', mealType: 'breakfast', calories: 350, protein: 12, carbs: 65, fats: 6, description: 'Slow-release energy' },
    { name: 'Whole Grain Pasta', mealType: 'lunch', calories: 550, protein: 20, carbs: 85, fats: 12, description: 'Carb-loading meal' },
    { name: 'Energy Bar', mealType: 'snack', calories: 250, protein: 10, carbs: 40, fats: 7, description: 'Quick energy boost' },
    { name: 'Rice and Beans', mealType: 'dinner', calories: 450, protein: 18, carbs: 75, fats: 8, description: 'Complex carbs for endurance' },
    { name: 'Sports Drink Smoothie', mealType: 'snack', calories: 200, protein: 8, carbs: 38, fats: 3, description: 'Electrolyte and energy replenishment' },
  ],
};

// @route   GET /api/recommendations/workouts
// @desc    Get personalized workout recommendations
// @access  Private
router.get('/workouts', protect, async (req, res) => {
  try {
    const userGoal = req.user.goal || 'maintenance';
    const recommendations = workoutRecommendations[userGoal] || workoutRecommendations.maintenance;
    
    res.json({
      goal: userGoal,
      recommendations,
      message: `Workout recommendations based on your ${userGoal.replace('_', ' ')} goal`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recommendations/meals
// @desc    Get personalized meal recommendations
// @access  Private
router.get('/meals', protect, async (req, res) => {
  try {
    const userGoal = req.user.goal || 'maintenance';
    const recommendations = mealRecommendations[userGoal] || mealRecommendations.maintenance;
    
    res.json({
      goal: userGoal,
      recommendations,
      message: `Meal recommendations based on your ${userGoal.replace('_', ' ')} goal`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recommendations/daily-targets
// @desc    Get daily calorie and macro targets
// @access  Private
router.get('/daily-targets', protect, async (req, res) => {
  try {
    const user = req.user;
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr;
    if (user.gender === 'male') {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    const tdee = bmr * (activityMultipliers[user.activityLevel] || 1.55);
    
    // Adjust calories based on goal
    let targetCalories;
    let proteinRatio, carbsRatio, fatsRatio;
    
    switch (user.goal) {
      case 'weight_loss':
        targetCalories = tdee - 500; // 500 calorie deficit
        proteinRatio = 0.35;
        carbsRatio = 0.35;
        fatsRatio = 0.30;
        break;
      case 'weight_gain':
        targetCalories = tdee + 500; // 500 calorie surplus
        proteinRatio = 0.30;
        carbsRatio = 0.45;
        fatsRatio = 0.25;
        break;
      case 'muscle_gain':
        targetCalories = tdee + 300; // 300 calorie surplus
        proteinRatio = 0.40;
        carbsRatio = 0.35;
        fatsRatio = 0.25;
        break;
      case 'endurance':
        targetCalories = tdee + 200;
        proteinRatio = 0.25;
        carbsRatio = 0.55;
        fatsRatio = 0.20;
        break;
      default: // maintenance
        targetCalories = tdee;
        proteinRatio = 0.30;
        carbsRatio = 0.40;
        fatsRatio = 0.30;
    }
    
    // Calculate macros (protein and carbs = 4 cal/g, fats = 9 cal/g)
    const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
    const carbsGrams = Math.round((targetCalories * carbsRatio) / 4);
    const fatsGrams = Math.round((targetCalories * fatsRatio) / 9);
    
    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fats: fatsGrams,
      },
      goal: user.goal,
      activityLevel: user.activityLevel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
