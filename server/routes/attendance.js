import express from 'express';
import Attendance from '../models/Attendance.js';
import Habit from '../models/Habit.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/attendance/stats/:habitId/:year/:month
// @desc    Get attendance statistics for a habit
// @access  Private
router.get('/stats/:habitId/:year/:month', protect, async (req, res) => {
  try {
    const { habitId, year, month } = req.params;

    // Verify user owns this habit
    const habit = await Habit.findById(habitId);
    if (!habit || habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const totalDays = endDate.getDate();
    const completed = await Attendance.countDocuments({
      userId: req.user.id,
      habitId,
      date: { $gte: startDate, $lte: endDate },
      completed: true
    });

    const percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalDays,
        completed,
        percentage,
        status: percentage >= 70 ? 'FIT' : 'UNFIT'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/attendance/:habitId/:year/:month
// @desc    Get attendance records for a habit in a month
// @access  Private
router.get('/:habitId/:year/:month', protect, async (req, res) => {
  try {
    const { habitId, year, month } = req.params;

    // Verify user owns this habit
    const habit = await Habit.findById(habitId);
    if (!habit || habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await Attendance.find({
      userId: req.user.id,
      habitId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/attendance
// @desc    Create or update attendance record
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { habitId, date, completed } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({ success: false, message: 'Please provide habitId and date' });
    }

    // Verify user owns this habit
    const habit = await Habit.findById(habitId);
    if (!habit || habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Normalize date to start of day
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Try to find existing record
    let record = await Attendance.findOne({
      userId: req.user.id,
      habitId,
      date: normalizedDate
    });

    if (record) {
      // Update existing record
      record.completed = completed;
      await record.save();
    } else {
      // Create new record
      record = await Attendance.create({
        userId: req.user.id,
        habitId,
        date: normalizedDate,
        completed
      });
    }

    res.status(200).json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
