const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const questionsFile = path.join(__dirname, '../data/questions.json');
const usersFile = path.join(__dirname, '../data/users.json');

const readQuestions = () => {
  try {
    return JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeQuestions = (questions) => {
  fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
};

const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Middleware to check if user is Member
const requireMember = (req, res, next) => {
  if (req.session.userType !== 'Member') {
    return res.status(403).json({ message: 'Members only' });
  }
  next();
};

// Get current question of the day
router.get('/', (req, res) => {
  const questions = readQuestions();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  let question = questions.find(q => q.date === today);

  if (!question) {
    // If no question for today, return a default or empty
    question = { id: null, title: 'No question for today', content: '', replies: [] };
  }

  res.json(question);
});

// Create/update question of the day (Members only)
router.post('/', requireAuth, requireMember, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const questions = readQuestions();
  const today = new Date().toISOString().split('T')[0];

  // Remove existing question for today if any
  const existingIndex = questions.findIndex(q => q.date === today);
  if (existingIndex !== -1) {
    questions.splice(existingIndex, 1);
  }

  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);

  const newQuestion = {
    id: uuidv4(),
    title,
    content,
    authorId: req.session.userId,
    authorUniqueId: user.uniqueId,
    date: today,
    replies: [],
    createdAt: new Date().toISOString()
  };

  questions.push(newQuestion);
  writeQuestions(questions);

  res.status(201).json(newQuestion);
});

// Add a reply to the question of the day
router.post('/reply', requireAuth, (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Reply content is required' });
  }

  const questions = readQuestions();
  const today = new Date().toISOString().split('T')[0];
  const question = questions.find(q => q.date === today);

  if (!question) {
    return res.status(404).json({ message: 'No question for today' });
  }

  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);

  const newReply = {
    id: uuidv4(),
    content,
    authorId: req.session.userId,
    authorUniqueId: user.uniqueId,
    createdAt: new Date().toISOString()
  };

  question.replies.push(newReply);
  writeQuestions(questions);

  // Update user's response count
  user.responseCount += 1;
  writeUsers(users);

  res.status(201).json(newReply);
});

module.exports = router;
