/**
 * Dashboard Page
 * Main user dashboard with overview, stats, and recommendations
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mealAPI, workoutAPI, recommendationAPI } from '../services/api';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't wish for it, work for it.",
  "The difference between try and triumph is a little umph.",
  "Believe in yourself and all that you are.",
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ meals: null, workouts: null });
  const [dailyTargets, setDailyTargets] = useState(null);
  const [recommendations, setRecommendations] = useState({ meals: [], workouts: [] });
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch data
      const [mealsRes, workoutsRes, targetsRes, mealRecsRes, workoutRecsRes] = await Promise.all([
        mealAPI.getStats({ startDate: today.toISOString(), endDate: tomorrow.toISOString() }),
        workoutAPI.getStats({ startDate: today.toISOString(), endDate: tomorrow.toISOString() }),
        recommendationAPI.getDailyTargets(),
        recommendationAPI.getMeals(),
        recommendationAPI.getWorkouts(),
      ]);

      setStats({
        meals: mealsRes.data,
        workouts: workoutsRes.data,
      });
      setDailyTargets(targetsRes.data);
      setRecommendations({
        meals: mealRecsRes.data.recommendations.slice(0, 3),
        workouts: workoutRecsRes.data.recommendations.slice(0, 3),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate BMI category
  const getBMICategory = (bmi) => {
    if (!bmi) return 'Unknown';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Calorie chart data
  const calorieChartData = dailyTargets && stats.meals && stats.workouts ? {
    labels: ['Consumed', 'Burned', 'Remaining'],
    datasets: [{
      data: [
        stats.meals.totalCalories,
        stats.workouts.totalCaloriesBurned,
        Math.max(0, dailyTargets.targetCalories - stats.meals.totalCalories + stats.workouts.totalCaloriesBurned)
      ],
      backgroundColor: ['#2A6EF3', '#FF6B6B', '#FBE8D3'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  } : null;

  // Macros chart data
  const macrosChartData = dailyTargets && stats.meals ? {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        label: 'Target (g)',
        data: [dailyTargets.macros.protein, dailyTargets.macros.carbs, dailyTargets.macros.fats],
        backgroundColor: '#FBE8D3',
      },
      {
        label: 'Current (g)',
        data: [stats.meals.totalProtein, stats.meals.totalCarbs, stats.meals.totalFats],
        backgroundColor: '#2A6EF3',
      },
    ],
  } : null;

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <div className="quote-card">
          <p className="quote">💡 "{quote}"</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <h3>Today's Calories</h3>
            <p className="stat-value">{stats.meals?.totalCalories || 0}</p>
            <p className="stat-label">kcal consumed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>Calories Burned</h3>
            <p className="stat-value">{stats.workouts?.totalCaloriesBurned || 0}</p>
            <p className="stat-label">kcal burned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-info">
            <h3>Workouts Today</h3>
            <p className="stat-value">{stats.workouts?.totalWorkouts || 0}</p>
            <p className="stat-label">sessions completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>Exercise Time</h3>
            <p className="stat-value">{stats.workouts?.totalDuration || 0}</p>
            <p className="stat-label">minutes</p>
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="health-summary">
        <div className="summary-card">
          <h3>📊 Your Health Profile</h3>
          <div className="health-info">
            <div className="health-item">
              <span className="label">BMI:</span>
              <span className="value">{user?.bmi?.toFixed(1) || 'N/A'} - {getBMICategory(user?.bmi)}</span>
            </div>
            <div className="health-item">
              <span className="label">Goal:</span>
              <span className="value">{user?.goal?.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="health-item">
              <span className="label">Activity Level:</span>
              <span className="value">{user?.activityLevel?.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="health-item">
              <span className="label">Daily Target:</span>
              <span className="value">{dailyTargets?.targetCalories || 'N/A'} kcal</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h3>🎯 Daily Macro Targets</h3>
          <div className="macros-info">
            <div className="macro-item">
              <span className="macro-label">Protein</span>
              <div className="macro-bar">
                <div 
                  className="macro-progress" 
                  style={{ width: `${Math.min(100, (stats.meals?.totalProtein || 0) / (dailyTargets?.macros.protein || 1) * 100)}%` }}
                ></div>
              </div>
              <span className="macro-value">{stats.meals?.totalProtein || 0}g / {dailyTargets?.macros.protein || 0}g</span>
            </div>
            <div className="macro-item">
              <span className="macro-label">Carbs</span>
              <div className="macro-bar">
                <div 
                  className="macro-progress" 
                  style={{ width: `${Math.min(100, (stats.meals?.totalCarbs || 0) / (dailyTargets?.macros.carbs || 1) * 100)}%` }}
                ></div>
              </div>
              <span className="macro-value">{stats.meals?.totalCarbs || 0}g / {dailyTargets?.macros.carbs || 0}g</span>
            </div>
            <div className="macro-item">
              <span className="macro-label">Fats</span>
              <div className="macro-bar">
                <div 
                  className="macro-progress" 
                  style={{ width: `${Math.min(100, (stats.meals?.totalFats || 0) / (dailyTargets?.macros.fats || 1) * 100)}%` }}
                ></div>
              </div>
              <span className="macro-value">{stats.meals?.totalFats || 0}g / {dailyTargets?.macros.fats || 0}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {calorieChartData && (
          <div className="chart-card">
            <h3>📈 Calorie Overview</h3>
            <Pie data={calorieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        )}

        {macrosChartData && (
          <div className="chart-card">
            <h3>🥗 Macronutrients</h3>
            <Bar data={macrosChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <div className="recommendation-section">
          <h3>🍽️ Recommended Meals</h3>
          <div className="recommendation-grid">
            {recommendations.meals.map((meal, index) => (
              <div key={index} className="recommendation-card">
                <h4>{meal.name}</h4>
                <p className="meal-type">{meal.mealType}</p>
                <p className="calories">{meal.calories} kcal</p>
                <p className="description">{meal.description}</p>
                <div className="macros-mini">
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fats}g</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendation-section">
          <h3>🏋️ Recommended Workouts</h3>
          <div className="recommendation-grid">
            {recommendations.workouts.map((workout, index) => (
              <div key={index} className="recommendation-card">
                <h4>{workout.name}</h4>
                <p className="workout-type">{workout.type}</p>
                <p className="duration">{workout.duration} min • {workout.caloriesBurned} kcal</p>
                <p className="description">{workout.description}</p>
                <span className={`intensity-badge ${workout.intensity}`}>{workout.intensity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
