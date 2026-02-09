const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const imagesFile = path.join(__dirname, '../data/images.json');
const uploadsDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const readImages = () => {
  try {
    return JSON.parse(fs.readFileSync(imagesFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeImages = (images) => {
  fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));
};

// Middleware to check authentication and Member status
const requireMember = (req, res, next) => {
  if (!req.session.userId || req.session.userType !== 'Member') {
    return res.status(403).json({ message: 'Members only' });
  }
  next();
};

// Get all images
router.get('/', (req, res) => {
  const images = readImages();
  res.json(images);
});

// Upload image (Members only)
router.post('/', requireMember, upload.single('image'), (req, res) => {
  const { description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const images = readImages();

  const newImage = {
    id: uuidv4(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    description: description || '',
    uploadedBy: req.session.userId,
    uploadedAt: new Date().toISOString()
  };

  images.push(newImage);
  writeImages(images);

  res.status(201).json(newImage);
});

// Serve uploaded images
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

module.exports = router;
