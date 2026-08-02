# 🚀 Running the App - Step by Step

## Prerequisites
- ✅ Node.js 16+ installed
- ✅ Port 5000 and 5173 available

## Step 1: Configure Backend

Edit `server/.env` with:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
```

## Step 2: Configure Frontend

Check `/.env.local` has:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Install Backend Dependencies

```bash
cd server
npm install
```

Wait for installation to complete.

## Step 4: Start Backend Server

Still in the `server` directory:
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║  🚀 Server is running on port 5000  ║
║  📝 API Base: http://localhost:5000/api  ║
╚════════════════════════════════════════╝
```

**Leave this terminal running!**

## Step 5: Open New Terminal for Frontend

In VS Code:
- Click Terminal → New Terminal

Or open a new command prompt in the project root.

## Step 6: Install Frontend Dependencies

```bash
npm install
```

## Step 7: Start Frontend Server

```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 8: Open the App

Click on `http://localhost:5173` or paste in browser.

## Step 9: Create Account & Start Tracking!

1. Click "Create Account"
2. Enter email and password
3. Click "Create Account"
4. You'll be logged in automatically
5. Click "+ Add Habit"
6. Enter habit name (e.g., "Wake Up at 5:30 AM")
7. Click checkboxes to track daily habits
8. Watch percentages calculate automatically!

---

## 📊 Running Multiple Terminals

You need **2 terminal windows**:

### Terminal 1 (Backend)
```bash
cd server
npm run dev
```

Port: 5000

### Terminal 2 (Frontend)
```bash
cd ..
npm run dev
```

Port: 5173

Both must be running for the app to work!

---

## 🔍 How to Tell If It's Working

### Backend Running ✅
- Terminal shows "Server is running on port 5000"
- Can visit http://localhost:5000/api/health
- Returns: `{"success":true,"message":"Server is running"}`

### Frontend Running ✅
- Terminal shows "Local: http://localhost:5173"
- Browser shows login page
- Can create account without errors

### Complete Setup ✅
- Can create account
- Can add habits
- Can click checkboxes
- Data saves automatically
- Percentages update

---

## 🚨 If Something Goes Wrong

### "Cannot find module" error
```bash
# In the problematic directory
npm install
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection error
- Check `MONGODB_URI` in `server/.env`
- Make sure MongoDB is running
- For Atlas: verify IP whitelist

### Blank page on localhost:5173
- Check browser console (F12 → Console)
- Check API URL in `.env.local`
- Verify backend is running

### Login doesn't work
- Check backend is running (port 5000)
- Look at server terminal for errors
- Check `.env.local` has correct API URL

---

## 💡 Useful Keyboard Shortcuts

### Stop Server
```
Ctrl + C
```

### Clear Terminal
```
Ctrl + L (or clear)
```

### Open Dev Tools
```
F12 (or Right-click → Inspect)
```

---

## 📱 Test the App

1. **Create Account**
   - Email: test@example.com
   - Password: TestPassword123

2. **Add Habits**
   - Wake Up 5:30 AM
   - Exercise
   - Study
   - Project Work

3. **Track Daily**
   - Click checkboxes for today
   - Navigate to different months
   - Watch statistics update

4. **Check Progress**
   - Daily % shows completion per day
   - Weekly % shows overall progress
   - Status shows FIT (✅) or UNFIT (❌)

---

## ✨ Features Working

✅ User authentication (register/login)
✅ Create/delete habits
✅ Track daily attendance
✅ Calculate daily percentages
✅ Calculate weekly percentages  
✅ Show FIT/UNFIT status
✅ Navigate months
✅ Auto-save on checkbox click
✅ Data persists in MongoDB
✅ Mobile responsive

---

## 📝 Next Steps

1. Verify both servers are running
2. Test creating an account
3. Add a few habits
4. Click some checkboxes
5. Watch the statistics update automatically!

For detailed setup: See `MONGODB_SETUP.md`  
For troubleshooting: See `MIGRATION_GUIDE.md`  
For full docs: See `README.md`

---

**You're all set! Start tracking! 🎉**
