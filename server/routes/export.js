const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {
  exportArticlesToPDF,
  exportArticlesToExcel,
  exportArticlesToWord,
  exportQuestionsToPDF,
  exportQuestionsToExcel,
  exportUsersToExcel
} = require('../utils/exportUtils');

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Middleware to check if user is a Member (admin)
const requireMember = (req, res, next) => {
  if (req.session.userType === 'Member') {
    next();
  } else {
    res.status(403).json({ message: 'Member access required' });
  }
};

// Get list of exported files
router.get('/files', requireAuth, requireMember, (req, res) => {
  const exportsDir = path.join(__dirname, '..', 'exports');

  if (!fs.existsSync(exportsDir)) {
    return res.json({ files: [] });
  }

  fs.readdir(exportsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading export directory' });
    }

    const fileDetails = files.map(file => {
      const filePath = path.join(exportsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });

    res.json({ files: fileDetails });
  });
});

// Download exported file
router.get('/download/:filename', requireAuth, requireMember, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'exports', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(500).json({ message: 'Error downloading file' });
    }
  });
});

// Export articles to PDF
router.post('/articles/pdf', requireAuth, requireMember, async (req, res) => {
  try {
    const articlesFile = path.join(__dirname, '..', 'data', 'articles.json');
    const articles = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));

    const filename = `articles_export_${Date.now()}.pdf`;
    const filePath = await exportArticlesToPDF(articles, filename);

    res.json({
      message: 'Articles exported to PDF successfully',
      filename: filename,
      downloadUrl: `/api/export/download/${filename}`
    });
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error exporting articles to PDF' });
  }
});

// Export articles to Excel
router.post('/articles/excel', requireAuth, requireMember, async (req, res) => {
  try {
    const articlesFile = path.join(__dirname, '..', 'data', 'articles.json');
    const articles = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));

    const filename = `articles_export_${Date.now()}.xlsx`;
    const filePath = await exportArticlesToExcel(articles, filename);

    res.json({
      message: 'Articles exported to Excel successfully',
      filename: filename,
      downloadUrl: `/api/export/download/${filename}`
    });
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Error exporting articles to Excel' });
  }
});

// Export articles to Word
router.post('/articles/word', requireAuth, requireMember, async (req, res) => {
  try {
    const articlesFile = path.join(__dirname, '..', 'data', 'articles.json');
    const articles = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));

    const filename = `articles_export_${Date.now()}.docx`;
    const filePath = await exportArticlesToWord(articles, filename);

    res.json({
      message: 'Articles exported to Word successfully',
      filename: filename,
      downloadUrl: `/api/export/download/${filename}`
    });
  } catch (error) {
    console.error('Word export error:', error);
    res.status(500).json({ message: 'Error exporting articles to Word' });
  }
});

// Export questions to PDF
router.post('/questions/pdf', requireAuth, requireMember, async (req, res) => {
  try {
    const questionsFile = path.join(__dirname, '..', 'data', 'questions.json');
    const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

    const filename = `questions_export_${Date.now()}.pdf`;
    const filePath = await exportQuestionsToPDF(questions, filename);

    res.json({
      message: 'Questions exported to PDF successfully',
      filename: filename,
      downloadUrl: `/api/export/download/${filename}`
    });
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error exporting questions to PDF' });
  }
});

// Export questions to Excel
router.post('/questions/excel', requireAuth, requireMember, async (req, res) => {
  try {
    const questionsFile = path.join(__dirname, '..', 'data', 'questions.json');
    const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

    const filename = `questions_export_${Date.now()}.xlsx`;
    const filePath = await exportQuestionsToExcel(questions, filename);

    res.json({
      message: 'Questions exported to Excel successfully',
      filename: filename,
      downloadUrl: `/api/export/download/${filename}`
    });
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Error exporting questions to Excel' });
  }
});

// Export users to Excel
router.post('/users/excel', requireAuth, requireMember, async (req, res) => {
  try {
    const usersFile = path.join(__dirname, '..', 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

    const filename = `users_export_${Date.now()}.xlsx`;
    const filePath = await exportUsersToExcel(users, filename);

    res.json({
      message: 'Users exported to Excel successfully',
      filename: filename,
      downloadUrl: `/api/export/download/${filename}`
    });
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Error exporting users to Excel' });
  }
});

// Delete exported file
router.delete('/files/:filename', requireAuth, requireMember, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'exports', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

module.exports = router;
