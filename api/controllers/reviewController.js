const Review = require('../models/review');
const Book = require('../models/book');
const { Op } = require('sequelize');

/**
 * Add a new review for a book
 */
exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Validate if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Create a new review
    const review = await Review.create({
      bookId,
      userId: req.user.id, // Assuming `req.user` is populated via authentication middleware
      rating,
      comment,
    });

    // Update average rating for the book
    const reviews = await Review.findAll({ where: { bookId } });
    const averageRating = (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(2);

    book.averageRating = averageRating;
    await book.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Edit an existing review
 */
exports.editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Find the review
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user owns the review
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this review' });
    }

    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update average rating for the book
    const reviews = await Review.findAll({ where: { bookId: review.bookId } });
    const averageRating = (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(2);

    const book = await Book.findByPk(review.bookId);
    book.averageRating = averageRating;
    await book.save();

    res.status(200).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user owns the review
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    // Delete the review
    const bookId = review.bookId;
    await review.destroy();

    // Update average rating for the book
    const reviews = await Review.findAll({ where: { bookId } });
    const averageRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
        : null;

    const book = await Book.findByPk(bookId);
    book.averageRating = averageRating;
    await book.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all reviews for a book
 */
exports.getReviewsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Fetch reviews for the book
    const reviews = await Review.findAll({ where: { bookId } });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all reviews by a user
 */
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [{ model: Book, attributes: ['title', 'author'] }],
    });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
