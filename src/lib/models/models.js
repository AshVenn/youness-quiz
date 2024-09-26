import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  remainingAttempts: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  prompt: { type: String, required: true }, // Prompt used to generate the quiz
  questions: [
    {
      text: { type: String, required: true },
      options: [{ type: String, required: true }], // Array of options
      correctAnswer: { type: Number, required: true } // Index of the correct answer
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who generated the quiz
  createdAt: { type: Date, default: Date.now }
});


// Attempt Schema
const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number, required: true }], // Stores the index of selected answers
  score: { type: Number, required: true }, // Calculated score after the quiz attempt
  attemptNumber: { type: Number, required: true }, // Tracks which attempt this is (1st, 2nd, etc.)
  createdAt: { type: Date, default: Date.now }
});

// Define and export the models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);

export { User, Quiz, Attempt };
