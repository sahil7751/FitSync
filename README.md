# 💪 FitSync - Fitness & Diet Recommendation Platform

A modern, full-stack web application for tracking workouts, monitoring nutrition, and receiving personalized fitness recommendations. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

### User Features
- 🔐 **Secure Authentication** - JWT-based authentication with password hashing
- 📊 **Interactive Dashboard** - Visual analytics with charts and progress tracking
- 🍽️ **Meal Tracking** - Log meals with detailed nutritional information
- 🏋️ **Workout Logging** - Track exercises with duration, intensity, and calories burned
- 🎯 **Personalized Recommendations** - AI-powered meal and workout suggestions based on goals
- 📈 **Progress Analytics** - View calories consumed vs. burned with visual charts
- 🧮 **BMI Calculator** - Automatic BMI calculation and health insights
- ⚙️ **Profile Settings** - Manage personal information and fitness goals
- 💡 **Motivational Quotes** - Daily inspiration on the dashboard

### Admin Features
- 🧑‍💼 **Admin Dashboard** - Comprehensive platform management
- 👥 **User Management** - View, edit, and delete user accounts
- 📊 **Data Oversight** - Monitor all meals and workouts across the platform
- 📈 **Platform Analytics** - Track total users, meals, and workouts

### Technical Features
- ✅ **Real-time Data Updates** - Instant refresh after adding/editing entries
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **Modern UI/UX** - Clean design with Royal Blue (#2A6EF3) and Warm Sand (#FBE8D3)
- 🔒 **Role-based Access Control** - Separate user and admin functionalities
- 🚀 **RESTful API** - Well-structured backend with proper error handling
- 🗄️ **MongoDB Integration** - Efficient data storage with Mongoose schemas

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.21.0 - Client-side routing
- **Axios** - HTTP client
- **Chart.js** & **React-ChartJS-2** - Data visualization
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.0.3 - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
FitSync/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Meal.js              # Meal schema
│   │   └── Workout.js           # Workout schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── mealRoutes.js        # Meal CRUD operations
│   │   ├── workoutRoutes.js     # Workout CRUD operations
│   │   ├── adminRoutes.js       # Admin operations
│   │   └── recommendationRoutes.js # Personalized recommendations
│   ├── server.js                # Express server setup
│   └── seedData.js              # Sample data for testing
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Layout.js        # Main layout wrapper
│       │   ├── Sidebar.js       # Navigation sidebar
│       │   ├── Modal.js         # Reusable modal
│       │   ├── PrivateRoute.js  # Protected route wrapper
│       │   └── AdminRoute.js    # Admin route wrapper
│       ├── context/
│       │   └── AuthContext.js   # Authentication state management
│       ├── pages/
│       │   ├── Home.js          # Landing page
│       │   ├── Register.js      # User registration
│       │   ├── UserLogin.js     # User login
│       │   ├── AdminLogin.js    # Admin login
│       │   ├── Dashboard.js     # Main dashboard
│       │   ├── Meals.js         # Meal management
│       │   ├── Workouts.js      # Workout management
│       │   ├── Settings.js      # Profile settings
│       │   └── AdminDashboard.js # Admin panel
│       ├── services/
│       │   └── api.js           # API service layer
│       ├── styles/
│       │   ├── index.css        # Global styles
│       │   ├── App.css
│       │   ├── Home.css
│       │   ├── Auth.css
│       │   ├── Layout.css
│       │   ├── Sidebar.css
│       │   ├── Modal.css
│       │   ├── Dashboard.css
│       │   ├── Meals.css
│       │   ├── Workouts.css
│       │   ├── Settings.css
│       │   └── AdminDashboard.css
│       ├── App.js               # Main App component
│       └── index.js             # Entry point
├── .env                         # Environment variables
├── .gitignore
├── package.json                 # Backend dependencies
└── README.md

```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   cd FitSync
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fitsync
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

6. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   npm run dev
   ```

8. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

9. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 🔑 Test Credentials

### Admin Account
- **Email:** admin@fitsync.com
- **Password:** admin123

### User Accounts
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123
- **Email:** mike@example.com | **Password:** password123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Meals
- `GET /api/meals` - Get all meals for logged-in user
- `GET /api/meals/:id` - Get single meal
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `GET /api/meals/stats/summary` - Get meal statistics

### Workouts
- `GET /api/workouts` - Get all workouts for logged-in user
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats/summary` - Get workout statistics

### Recommendations
- `GET /api/recommendations/workouts` - Get personalized workout recommendations
- `GET /api/recommendations/meals` - Get personalized meal recommendations
- `GET /api/recommendations/daily-targets` - Get daily calorie and macro targets

### Admin (Protected - Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/meals` - Get all meals
- `DELETE /api/admin/meals/:id` - Delete meal
- `GET /api/admin/workouts` - Get all workouts
- `DELETE /api/admin/workouts/:id` - Delete workout
- `GET /api/admin/stats` - Get platform statistics

## 🎯 Key Features Implementation

### 1. Authentication System
- JWT-based authentication with secure token storage
- Password hashing using bcryptjs
- Role-based access control (User/Admin)
- Protected routes on both frontend and backend

### 2. Real-time Data Updates
- Automatic refresh after CRUD operations
- Optimistic UI updates for better UX
- Context API for global state management

### 3. Personalized Recommendations
- Dynamic meal recommendations based on user goals
- Workout suggestions tailored to fitness objectives
- BMR and TDEE calculations for accurate calorie targets
- Macro distribution based on activity level and goals

### 4. Visual Analytics
- Pie chart for calorie overview (consumed/burned/remaining)
- Bar chart for macronutrient tracking
- Progress bars for daily macro targets
- Statistical summaries with color-coded indicators

### 5. Responsive Design
- Mobile-first approach
- Collapsible sidebar on smaller screens
- Touch-friendly interface
- Adaptive grid layouts

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with sample data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env` file
- For MongoDB Atlas, ensure IP whitelist is configured

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Change port in `client/package.json` proxy setting

### JWT Errors
- Clear browser localStorage
- Check JWT_SECRET in `.env` file
- Verify token expiration settings

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from GitHub or using CLI
3. Ensure MongoDB Atlas connection string is set

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Set API URL environment variable

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer Notes

- All API routes are properly documented with JSDoc comments
- Database models include validation and pre-save hooks
- Error handling middleware catches and formats all errors
- CORS is enabled for cross-origin requests
- Password fields are excluded from API responses
- BMI calculation is automatic on user profile updates

## 🙏 Acknowledgments

- Chart.js for beautiful data visualizations
- MongoDB for flexible data storage
- React team for the amazing framework
- Express.js for the robust backend framework

---

**Built with ❤️ for a healthier lifestyle** 💪🏃‍♂️🥗
