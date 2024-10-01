import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true},
  lastName:{ type: String, required: true},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  remainingAttempts: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: false, default: null }, // Subject can be null
  timerEnabled: { type: Boolean, default: false },
  timerDuration: { type: Number } // in seconds
});


// Attempt Schema
const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number, required: false }],
  score: { type: Number, required: true },
  attemptNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  timeTaken: { type: Number } // in seconds
});

// Subject Schema
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

export { User, Quiz, Attempt, Subject };