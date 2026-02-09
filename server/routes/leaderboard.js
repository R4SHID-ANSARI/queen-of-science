const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

// Get leaderboard (Champions of Sociology)
router.get('/', (req, res) => {
  const users = readUsers();

  // Filter users with complete profiles and sort by article count descending
  const leaderboard = users
    .filter(user => user.name && user.age && user.college)
    .map(user => ({
      name: user.name,
      age: user.age,
      college: user.college,
      uniqueId: user.uniqueId,
      articleCount: user.articleCount,
      responseCount: user.responseCount
    }))
    .sort((a, b) => b.articleCount - a.articleCount);

  res.json(leaderboard);
});

module.exports = router;
