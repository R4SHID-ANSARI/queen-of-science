const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const articlesFile = path.join(__dirname, '../data/articles.json');
const usersFile = path.join(__dirname, '../data/users.json');

const readArticles = () => {
  try {
    return JSON.parse(fs.readFileSync(articlesFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeArticles = (articles) => {
  fs.writeFileSync(articlesFile, JSON.stringify(articles, null, 2));
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

// Get all articles
router.get('/', (req, res) => {
  const articles = readArticles();
  res.json(articles);
});

// Get a specific article
router.get('/:id', (req, res) => {
  const articles = readArticles();
  const article = articles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }
  res.json(article);
});

// Create a new article
router.post('/', requireAuth, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const articles = readArticles();
  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);

  const newArticle = {
    id: uuidv4(),
    title,
    content,
    authorId: req.session.userId,
    authorUniqueId: user.uniqueId,
    replies: [],
    createdAt: new Date().toISOString()
  };

  articles.push(newArticle);
  writeArticles(articles);

  // Update user's article count
  user.articleCount += 1;
  writeUsers(users);

  res.status(201).json(newArticle);
});

// Update an article (only by author)
router.put('/:id', requireAuth, (req, res) => {
  const { title, content } = req.body;
  const articles = readArticles();
  const articleIndex = articles.findIndex(a => a.id === req.params.id);

  if (articleIndex === -1) {
    return res.status(404).json({ message: 'Article not found' });
  }

  const article = articles[articleIndex];
  if (article.authorId !== req.session.userId) {
    return res.status(403).json({ message: 'Not authorized to edit this article' });
  }

  article.title = title || article.title;
  article.content = content || article.content;
  article.updatedAt = new Date().toISOString();

  writeArticles(articles);
  res.json(article);
});

// Delete an article (only by author)
router.delete('/:id', requireAuth, (req, res) => {
  const articles = readArticles();
  const articleIndex = articles.findIndex(a => a.id === req.params.id);

  if (articleIndex === -1) {
    return res.status(404).json({ message: 'Article not found' });
  }

  const article = articles[articleIndex];
  if (article.authorId !== req.session.userId) {
    return res.status(403).json({ message: 'Not authorized to delete this article' });
  }

  articles.splice(articleIndex, 1);
  writeArticles(articles);

  // Update user's article count
  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);
  user.articleCount -= 1;
  writeUsers(users);

  res.json({ message: 'Article deleted successfully' });
});

// Add a reply to an article
router.post('/:id/reply', requireAuth, (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Reply content is required' });
  }

  const articles = readArticles();
  const article = articles.find(a => a.id === req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
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

  article.replies.push(newReply);
  writeArticles(articles);

  // Update user's response count
  user.responseCount += 1;
  writeUsers(users);

  res.status(201).json(newReply);
});

module.exports = router;
