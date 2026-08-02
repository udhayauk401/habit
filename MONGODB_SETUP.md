# ⚠️ MongoDB Setup - DEPRECATED

This file is **no longer needed**. MongoDB has been removed from this project and replaced with in-memory data storage.

## What Changed?

- ✅ **Removed**: MongoDB/Mongoose dependency
- ✅ **Added**: In-memory database (`server/db/memoryDB.js`)
- ✅ **Removed**: Database connection configuration
- ✅ **Simplified**: No external database required

## Current Setup

Your application now uses an in-memory database for development and testing. This is much simpler to set up!

### For Development
- No database setup required
- Just run `npm install` and `npm run dev`
- Data is stored in server memory

### For Production
If you need persistent data storage, consider:
1. **MongoDB** - See archived MongoDB docs
2. **PostgreSQL** - Open source relational database
3. **Firebase** - NoSQL cloud database
4. **Supabase** - PostgreSQL with easy setup
5. **Any other database** - Replace the `memoryDB.js` with your choice

## Quick Start

```bash
# 1. Install dependencies
cd server
npm install

# 2. Configure .env
echo "PORT=5000" > .env
echo "JWT_SECRET=your_secret_key" >> .env

# 3. Start server
npm run dev
```

See `MIGRATION_GUIDE.md` for full setup instructions.

---

**Note**: This file is kept for historical reference. The project no longer uses MongoDB.
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 3: Verify Connection
```bash
mongosh
```

---

## Backend Setup & Running

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Environment
Edit `server/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=

```

### Step 3: Start Backend Server
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

---

## Frontend Setup & Running

### Step 1: Install Dependencies
```bash
cd ..
npm install
```

### Step 2: Configure Environment
Edit `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Server
```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Running Both Servers Together

### Option A: Two Terminal Windows
**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Option B: Using Concurrently (Optional)
Install in root directory:
```bash
npm install --save-dev concurrently
```

Add to root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"npm --prefix server run dev\" \"npm run dev\""
  }
}
```

Then run:
```bash
npm run dev
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `DELETE /api/habits/:id` - Delete habit

### Attendance
- `GET /api/attendance/:habitId/:year/:month` - Get monthly attendance
- `POST /api/attendance` - Toggle attendance
- `GET /api/attendance/stats/:habitId/:year/:month` - Get stats

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service or check your connection string

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check `CORS_ORIGIN` in `server/.env` matches frontend URL

### JWT Token Error
```
Not authorized to access this route
```
**Solution:** 
- Make sure token is stored in localStorage after login
- Check JWT_SECRET is same in server

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** 
- Change PORT in `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

---

## Testing the API

### Using Postman or Thunder Client

1. **Register User**
   - Method: POST
   - URL: http://localhost:5000/api/auth/register
   - Body: `{"email": "test@example.com", "password": "password123"}`

2. **Login**
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Body: `{"email": "test@example.com", "password": "password123"}`
   - Response includes token

3. **Create Habit** (add token to Authorization header)
   - Method: POST
   - URL: http://localhost:5000/api/habits
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body: `{"name": "Wake Up"}`

---

## Next Steps

1. Ensure both servers are running
2. Visit http://localhost:5173
3. Create an account
4. Add habits and start tracking!

For more info, see README.md in the root directory.
