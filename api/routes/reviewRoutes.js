const express = require('express');
const {
  addReview,
  editReview,
  deleteReview,
  getReviewsForBook,
  getReviewsByUser,
} = require('../controllers/reviewController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, addReview); // Add a new review
router.put('/:id', authenticate, editReview); // Edit a review
router.delete('/:id', authenticate, deleteReview); // Delete a review
router.get('/book/:bookId', getReviewsForBook); // Get reviews for a specific book
router.get('/user', authenticate, getReviewsByUser); // Get reviews by logged-in user

module.exports = router;
