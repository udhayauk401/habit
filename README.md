# Daily Routine & Attendance Tracker

A modern web application built with React and Firebase to track your daily habits and routines. Monitor your attendance, calculate weekly/daily percentages, and visualize your progress.

## Features

✅ **User Authentication**
- Email/Password login with Firebase
- Sign up for new users
- Forgot password option

✅ **Timetable Management**
- Create and manage daily habits
- Organize habits by week
- Real-time updates with Firestore

✅ **Attendance Tracking**
- Weekly checkbox system (7 days)
- Monthly view with multiple weeks
- Auto-save when checkbox is clicked

✅ **Analytics & Progress**
- Daily percentage calculation per day
- Weekly percentage calculation
- Status badges (FIT if > 70%, UNFIT if < 70%)
- Visual progress indicators

✅ **Mobile Responsive**
- Fully responsive design
- Works on all devices (desktop, tablet, mobile)
- Optimized UI for touch interactions

## Project Structure

```
src/
├── components/
│   ├── LoginPage.jsx          # Authentication page
│   ├── Dashboard.jsx          # Main dashboard with habit management
│   ├── HabitTable.jsx         # Habit table with statistics
│   └── WeekColumn.jsx         # Week column with checkboxes
├── styles/
│   ├── LoginPage.css          # Login page styles
│   ├── Dashboard.css          # Dashboard styles
│   ├── HabitTable.css         # Habit table styles
│   └── WeekColumn.css         # Week column styles
├── firebase.js                # Firebase configuration
├── App.jsx                    # Main app with routing
├── App.css                    # Global app styles
├── index.css                  # Global styles
└── main.jsx                   # React entry point
```

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: "habit-tracker-demo"
4. Create the project

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Email link sign-in** (optional)

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode**
4. Choose a region (e.g., us-central1)

### 4. Get Firebase Config

1. Go to **Project Settings**
2. Find your Firebase config under "Your apps"
3. Copy the configuration object

### 5. Update firebase.js

Replace the firebaseConfig in `src/firebase.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Firestore Data Structure

```
users/
  {userId}/
    ├── email: "user@example.com"
    ├── habits: [
    │   "Wake Up",
    │   "Exercise",
    │   "Study"
    │ ]
    └── attendance: {
        "habit0": {
          "week1-day0": true,
          "week1-day1": false,
          ...
        },
        "habit1": {...},
        ...
      }
```

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Steps

1. **Navigate to project**
```bash
cd "c:\Users\udhaya\time table"
```

2. **Install dependencies**
```bash
npm install
```

3. **Update Firebase configuration**
   - Open `src/firebase.js`
   - Replace with your Firebase config

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
   - Visit `http://localhost:5173`

## Usage Guide

### 1. Authentication
- **New User**: Click "Create Account" and sign up with email/password
- **Existing User**: Log in with your credentials
- **First Login**: You'll be prompted to create your first habit

### 2. Add Habits
- Click "+ Add Habit" button
- Enter habit name (e.g., "Wake Up 5:30 AM")
- Click "Add Habit" to save

### 3. Track Attendance
- Click checkboxes under each day (Su-Sa) for each habit
- Checkmarks will be saved automatically to Firestore
- Green checkmark ✔ = Completed
- Empty ☐ = Not completed

### 4. View Progress
- **Daily %**: Shows completion percentage for each day
- **Weekly %**: Shows weekly completion percentage
- **Status**: 
  - ✅ FIT (if weekly % >= 70%)
  - ❌ UNFIT (if weekly % < 70%)

### 5. Navigate Months
- Use "Prev" and "Next" buttons to switch months
- View all weeks of the month in a single table

### 6. Delete Habits
- Click the "✕" button next to a habit name to delete it
- Changes are saved immediately

## Calculations

### Daily Percentage
```
Daily % = (Checked Habits / Total Habits) × 100
```

### Weekly Percentage
```
Weekly % = (Total Checked Boxes / (Habits × 7 Days)) × 100
```

### Status
- **FIT**: Weekly % ≥ 70%
- **UNFIT**: Weekly % < 70%

## Styling & Design

### Color Scheme
- Primary: #667eea (Purple-Blue)
- Secondary: #764ba2 (Deep Purple)
- Success: #27ae60 (Green)
- Danger: #e74c3c (Red)

### Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: Below 768px

## Features in Detail

### Auto-Save
Every checkbox click is automatically saved to Firestore in real-time.

### Real-time Updates
Firebase Firestore provides real-time synchronization across devices.

### Monthly Navigation
Switch between months to view different time periods. Each month shows all its weeks in one view.

### User Persistence
Your habits and attendance data are securely stored in Firestore and synced across all your devices.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Firebase Not Working
1. Check your Firebase config in `src/firebase.js`
2. Ensure Firestore database is created
3. Check Firestore rules are in test mode (or configure properly)

### Checkboxes Not Saving
1. Check browser console for errors
2. Verify Firebase authentication is working
3. Check Firestore database rules

### Authentication Issues
1. Ensure Email/Password provider is enabled in Firebase
2. Check Firebase project credentials
3. Clear browser cache and try again

## Future Enhancements

- [ ] Password reset functionality
- [ ] Social sharing of progress
- [ ] Custom date range reports
- [ ] Habit notifications
- [ ] Dark mode
- [ ] Photo progress tracking
- [ ] Goal setting and tracking
- [ ] Recurring habits with custom frequency

## Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Build the project**
```bash
npm run build
```

3. **Initialize Firebase Hosting**
```bash
firebase init hosting
```

4. **Deploy**
```bash
firebase deploy
```

### Deploy to Other Platforms
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Configure in package.json

## License
MIT License - feel free to use and modify

## Support
For issues and questions, please check the Firebase documentation or create an issue in the repository.

---

**Happy Tracking! 📅✨**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
