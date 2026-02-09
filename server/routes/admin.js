const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const adminFile = path.join(__dirname, '../data/admin.json');

// Middleware to check authentication and Member status
const requireMember = (req, res, next) => {
  if (!req.session.userId || req.session.userType !== 'Member') {
    return res.status(403).json({ message: 'Members only' });
  }
  next();
};

const readAdmin = () => {
  try {
    return JSON.parse(fs.readFileSync(adminFile, 'utf8'));
  } catch (error) {
    return {
      rules: "Default rules and regulations",
      regulations: "Default regulations",
      ownership: "Site owned by [Owner Name]"
    };
  }
};

const writeAdmin = (data) => {
  fs.writeFileSync(adminFile, JSON.stringify(data, null, 2));
};

// Get admin data
router.get('/', (req, res) => {
  const adminData = readAdmin();
  res.json(adminData);
});

// Update admin data (Members only)
router.put('/', requireMember, (req, res) => {
  const { rules, regulations, ownership } = req.body;
  const adminData = readAdmin();

  adminData.rules = rules || adminData.rules;
  adminData.regulations = regulations || adminData.regulations;
  adminData.ownership = ownership || adminData.ownership;

  writeAdmin(adminData);
  res.json({ message: 'Admin data updated successfully' });
});

module.exports = router;
