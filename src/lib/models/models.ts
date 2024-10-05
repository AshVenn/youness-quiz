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

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
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
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  timerEnabled: { type: Boolean, default: false },
  timerDuration: { type: Number },
  featured: { type: Boolean, default: false },
  public: { type: Boolean, default: false },
  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 0 },
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


const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
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
  status: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
})
// Schéma de la Catégorie
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
});

// Virtual pour les sujets
categorySchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'category',
});

// Options pour inclure les virtuals dans les sorties JSON
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });




const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
const Request = mongoose.models.Request || mongoose.model('Request', requestSchema)
const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema)

export { User, Quiz, Attempt, Subject, Settings,Request,Category,Rating };
