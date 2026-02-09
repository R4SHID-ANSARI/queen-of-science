const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost on any port
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    // Allow specific origins if needed
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'queen-of-science-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Data files
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const usersFile = path.join(dataDir, 'users.json');
const articlesFile = path.join(dataDir, 'articles.json');
const questionsFile = path.join(dataDir, 'questions.json');
const imagesFile = path.join(dataDir, 'images.json');
const adminFile = path.join(dataDir, 'admin.json');

// Helper functions
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Initialize data files if they don't exist
const initializeDataFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initializeDataFile(usersFile, []);
// Add default user if no users exist
const users = readData(usersFile);
if (users.length === 0) {
  users.push({
    id: 'default-user-id',
    email: 'admin@example.com',
    phone: null,
    uniqueId: 'admin',
    password: 'admin123',
    userType: 'Member',
    articleCount: 0,
    responseCount: 0,
    age: 25,
    college: 'Example College',
    name: 'Admin User'
  });
  writeData(usersFile, users);
}
initializeDataFile(articlesFile, []);
initializeDataFile(questionsFile, []);
initializeDataFile(imagesFile, []);
initializeDataFile(adminFile, {
  rules: "Default rules and regulations",
  regulations: "Default regulations",
  ownership: "Site owned by [Owner Name]"
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/images', require('./routes/images'));
app.use('/api/export', require('./routes/export'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
