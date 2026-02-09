const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '../data/users.json');

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

// Signup route
router.post('/signup', (req, res) => {
  const { email, phone, uniqueId, password, userType } = req.body;

  if (!uniqueId || !password || !userType) {
    return res.status(400).json({ message: 'Unique ID, password, and user type are required' });
  }

  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }

  if (userType !== 'Member' && userType !== 'Student') {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  const users = readUsers();

  // Check if uniqueId is already taken
  if (users.some(user => user.uniqueId === uniqueId)) {
    return res.status(400).json({ message: 'Unique ID already exists' });
  }

  // Check if email or phone is already registered
  if (email && users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  if (phone && users.some(user => user.phone === phone)) {
    return res.status(400).json({ message: 'Phone already registered' });
  }

  const newUser = {
    id: uuidv4(),
    email: email || null,
    phone: phone || null,
    uniqueId,
    password, // In production, hash the password
    userType,
    articleCount: 0,
    responseCount: 0,
    age: null,
    college: null,
    name: null
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User created successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const { identifier, password } = req.body; // identifier can be uniqueId, email, or phone

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }

  const users = readUsers();
  const user = users.find(u =>
    u.uniqueId === identifier ||
    u.email === identifier ||
    u.phone === identifier
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Set session
  req.session.userId = user.id;
  req.session.userType = user.userType;

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      uniqueId: user.uniqueId,
      userType: user.userType
    }
  });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    uniqueId: user.uniqueId,
    userType: user.userType,
    name: user.name,
    age: user.age,
    college: user.college,
    articleCount: user.articleCount,
    responseCount: user.responseCount
  });
});

// Update user profile
router.put('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { name, age, college } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = name || user.name;
  user.age = age || user.age;
  user.college = college || user.college;

  writeUsers(users);

  res.json({ message: 'Profile updated successfully' });
});

module.exports = router;
