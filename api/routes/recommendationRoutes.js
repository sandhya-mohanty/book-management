const express = require('express');
// const { recommendBooks, recommendByBook } = require('../controllers/recommendationController');
const authenticate = require('../middleware/authMiddleware');
const { recommendBooks, recommendByBook } = require('../controllers/recommendationControllre');

const router = express.Router();

// Recommend books based on user preferences
router.get('/user', authenticate, recommendBooks);

// Recommend books based on a specific book
router.get('/book/:bookId', recommendByBook);

module.exports = router;
