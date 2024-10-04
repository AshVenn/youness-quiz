// models.ts

import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName:{ type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  remainingAttempts: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now },
  // Prepare for future subscription feature
  subscriptionStatus: { type: String, enum: ['free', 'premium', 'trial'], default: 'free' },
  subscriptionExpiresAt: { type: Date },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Added title field
  prompt: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: false, default: null },
  timerEnabled: { type: Boolean, default: false },
  timerDuration: { type: Number },
  featured: { type: Boolean, default: false },
});

// Attempt Schema
const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  attemptNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  timeTaken: { type: Number },
});

// Subject (Category) Schema
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
});

// Settings Schema
const settingsSchema = new mongoose.Schema({
  defaultAttempts: { type: Number, default: 5 },
  defaultQuizTimeLimit: { type: Number, default: 600 }, // in seconds
  enablePublicLeaderboards: { type: Boolean, default: false },
  enableInstantFeedback: { type: Boolean, default: false },
  maxQuestionsPerQuiz: { type: Number, default: 20 },
});

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['En attente', 'Résolu', 'Rejeté'], default: 'En attente' },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
const Request = mongoose.models.Request || mongoose.model('Request', requestSchema)

export { User, Quiz, Attempt, Subject, Settings,Request };
