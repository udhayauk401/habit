import express from 'express';
import Habit from '../models/Habit.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all habits for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: habits.length,
      habits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/habits
// @desc    Create a habit
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide habit name' });
    }

    const habit = await Habit.create({
      userId: req.user.id,
      name
    });

    res.status(201).json({
      success: true,
      habit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Check if user owns the habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this habit' });
    }

    await Habit.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Habit deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
