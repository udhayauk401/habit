import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a habit name'],
    trim: true,
    maxlength: [100, 'Habit name cannot be more than 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
