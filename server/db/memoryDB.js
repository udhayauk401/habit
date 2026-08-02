// In-memory database for Users, Habits, and Attendance
class MemoryDB {
  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.attendance = new Map();
    this.nextUserId = 1;
    this.nextHabitId = 1;
    this.nextAttendanceId = 1;
  }

  // User operations
  createUser(email, hashedPassword) {
    const userId = String(this.nextUserId++);
    const user = {
      _id: userId,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    this.users.set(userId, user);
    return user;
  }

  findUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) {
        return { ...user };
      }
    }
    return null;
  }

  findUserById(userId) {
    const user = this.users.get(userId);
    return user ? { ...user } : null;
  }

  // Habit operations
  createHabit(userId, name) {
    const habitId = String(this.nextHabitId++);
    const habit = {
      _id: habitId,
      userId,
      name,
      createdAt: new Date()
    };
    this.habits.set(habitId, habit);
    return habit;
  }

  findHabitById(habitId) {
    const habit = this.habits.get(habitId);
    return habit ? { ...habit } : null;
  }

  findHabitsByUserId(userId) {
    const userHabits = [];
    for (let habit of this.habits.values()) {
      if (habit.userId === userId) {
        userHabits.push({ ...habit });
      }
    }
    return userHabits.sort((a, b) => b.createdAt - a.createdAt);
  }

  deleteHabit(habitId) {
    return this.habits.delete(habitId);
  }

  // Attendance operations
  createAttendance(userId, habitId, date, completed = false) {
    const attendanceId = String(this.nextAttendanceId++);
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const attendance = {
      _id: attendanceId,
      userId,
      habitId,
      date: normalizedDate,
      completed,
      createdAt: new Date()
    };
    this.attendance.set(attendanceId, attendance);
    return attendance;
  }

  findAttendanceByUserHabitDate(userId, habitId, date) {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    for (let record of this.attendance.values()) {
      if (
        record.userId === userId &&
        record.habitId === habitId &&
        record.date.getTime() === normalizedDate.getTime()
      ) {
        return { ...record };
      }
    }
    return null;
  }

  findAttendanceByUserHabitMonth(userId, habitId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = [];
    for (let record of this.attendance.values()) {
      if (
        record.userId === userId &&
        record.habitId === habitId &&
        record.date >= startDate &&
        record.date <= endDate
      ) {
        records.push({ ...record });
      }
    }
    return records;
  }

  countCompletedAttendance(userId, habitId, startDate, endDate) {
    let count = 0;
    for (let record of this.attendance.values()) {
      if (
        record.userId === userId &&
        record.habitId === habitId &&
        record.date >= startDate &&
        record.date <= endDate &&
        record.completed === true
      ) {
        count++;
      }
    }
    return count;
  }

  updateAttendance(userId, habitId, date, completed) {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    for (let [id, record] of this.attendance.entries()) {
      if (
        record.userId === userId &&
        record.habitId === habitId &&
        record.date.getTime() === normalizedDate.getTime()
      ) {
        record.completed = completed;
        return { ...record };
      }
    }
    return null;
  }
}

// Create singleton instance
const db = new MemoryDB();

export default db;
