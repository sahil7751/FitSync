# 🚀 Quick Start Guide - FitSync Platform

## Prerequisites Installed ✅
- Node.js
- MongoDB
- All dependencies installed!

## 🎯 Steps to Run the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start MongoDB manually
mongod

# macOS/Linux
sudo service mongod start
```

### 2. Seed the Database (First Time Only)
Open a terminal in the FitSync folder and run:
```bash
npm run seed
```

This will create:
- 1 Admin account
- 3 Test user accounts
- Sample meals and workouts

### 3. Start the Backend Server
In the FitSync folder:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📊 Environment: development
```

### 4. Start the Frontend (New Terminal)
Open a NEW terminal window, navigate to the client folder:
```bash
cd client
npm start
```

The React app will open automatically at `http://localhost:3000`

## 🔑 Login Credentials

### Admin Dashboard
- **URL:** Click "Admin Login" on home page
- **Email:** admin@fitsync.com
- **Password:** admin123

### User Dashboard
- **URL:** Click "User Login" on home page
- **Email:** john@example.com
- **Password:** password123

Or create your own account by clicking "Create Account"!

## 🎨 Features to Test

### As a User:
1. ✅ **Dashboard** - View your fitness stats, charts, and recommendations
2. 🍽️ **Add Meals** - Log breakfast, lunch, dinner, or snacks with nutrition info
3. 🏋️ **Add Workouts** - Track your exercises with duration and calories
4. ⚙️ **Settings** - Update your profile, goals, and view BMI
5. 📊 **Analytics** - See progress with visual charts

### As an Admin:
1. 📊 **Overview** - View platform statistics
2. 👥 **Users** - Manage all user accounts
3. 🍽️ **Meals** - View and delete any meal entry
4. 🏋️ **Workouts** - View and delete any workout entry

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct settings
- Check if port 5000 is available

### Frontend won't start
- Make sure backend is running first
- Check if port 3000 is available
- Try deleting `node_modules` and running `npm install` again

### Can't login
- Make sure you ran `npm run seed` to create test accounts
- Check MongoDB is connected
- Verify backend is running on port 5000

## 📱 Testing the App

1. **Create Account** → Register a new user
2. **Login** → Access your dashboard
3. **Add a Meal** → Go to "Add Meals" and log your breakfast
4. **Add a Workout** → Go to "Add Workouts" and log a run
5. **View Dashboard** → See your stats update automatically!
6. **Try Admin** → Logout and login as admin to see the admin panel

## 🎉 You're All Set!

The platform is fully functional with:
- ✅ Secure authentication
- ✅ Real-time data updates
- ✅ Beautiful responsive UI
- ✅ Personalized recommendations
- ✅ Visual analytics with charts
- ✅ Admin management panel

**Enjoy tracking your fitness journey with FitSync!** 💪🏃‍♂️🥗
