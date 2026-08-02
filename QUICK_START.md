# 🚀 Quick Start Guide

## 1. Firebase Setup (IMPORTANT!)

Before running the app, you need to set up Firebase:

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a new project"
3. Name it: "habit-tracker"
4. Create the project

### Step 2: Enable Email/Password Authentication
1. In Firebase, go to **Authentication**
2. Click **Sign-in method**
3. Enable **Email/Password**
4. Save

### Step 3: Create Firestore Database
1. In Firebase, go to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose region: **us-central1** (or nearest to you)
5. Create

### Step 4: Get Your Firebase Config
1. In Firebase, go to **Project Settings** (⚙️ icon)
2. Scroll down to "Your apps"
3. Under "Web app (</> icon)", copy your config
4. It should look like:
```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### Step 5: Update src/firebase.js
1. Open `src/firebase.js`
2. Replace the firebaseConfig object with your config from Step 4
3. Save the file

## 2. Run the Application

### Option A: Using npm (Recommended)
```bash
cd "c:\Users\udhaya\time table"
npm run dev
```

### Option B: Using Visual Studio Code Terminal
1. Open the integrated terminal in VS Code
2. Type: `npm run dev`
3. Wait for "Local: http://localhost:5173"
4. Click the link or visit in browser

## 3. First Time Usage

### Create Account
1. Click "Create Account"
2. Enter your email and password
3. Click "Create Account"
4. You'll be logged in automatically

### Login
1. If you already have an account, click "Already have an account? Login"
2. Enter email and password
3. Click "Login"

### Add Your First Habit
1. Click "+ Add Habit"
2. Enter habit name: "Wake Up at 5:30 AM"
3. Click "Add Habit"
4. Add more habits as needed

### Track Your Habits
1. Click checkboxes (☐) to mark habits as completed
2. Checkmarks save automatically to Firebase
3. View your daily and weekly percentages
4. Check your status (FIT/UNFIT)

## 4. Available Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 5. Important Notes

⚠️ **Firebase Test Mode**
- The app uses Firebase test mode for easy setup
- In production, configure proper Firestore security rules
- Test mode allows anyone to read/write (not secure for production)

⚠️ **Data Persistence**
- All data is stored in Firebase Firestore
- Changes are synced in real-time
- Data is safe and automatically backed up

✅ **Best Features**
- ✔️ Real-time synchronization across devices
- ✔️ Automatic data saving on every checkbox click
- ✔️ Responsive design for mobile/tablet
- ✔️ Monthly view with all weeks visible
- ✔️ Automatic percentage calculations

## 6. Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Firebase connection errors
1. Check your Firebase config in `src/firebase.js`
2. Ensure Firestore database is created
3. Check that Email/Password is enabled in Authentication

### App won't load
1. Check browser console for errors (F12 → Console tab)
2. Clear cache: Ctrl+Shift+Delete
3. Restart dev server: Stop and run `npm run dev` again

### Checkboxes not saving
1. Check Firebase Firestore is created
2. Check that user is logged in
3. Look at browser console for network errors

## 7. Default Demo User (Optional)

You can create a demo account with:
- **Email**: demo@example.com
- **Password**: Demo123!

Then log in to test the app without setting up multiple accounts.

## 8. Next Steps

After getting the app running:
1. Explore the habit tracking interface
2. Add your own habits
3. Track your progress daily
4. Watch your percentages update
5. Try the monthly navigation

## 📚 More Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Questions or Issues?** Check the README.md for detailed documentation!

🎉 **Happy Tracking!**
