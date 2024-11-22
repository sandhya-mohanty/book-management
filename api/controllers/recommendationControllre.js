const Book = require('../models/book');
const Review = require('../models/review');
const { Op } = require('sequelize');

/**
 * Recommend books based on user's rating patterns
 */
exports.recommendBooks = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming `req.user` is populated via authentication middleware

    // Step 1: Find books the user has rated highly (4 or 5 stars)
    const userReviews = await Review.findAll({
      where: { userId, rating: { [Op.gte]: 4 } },
      include: [{ model: Book, attributes: ['id', 'genre', 'author'] }],
    });

    if (userReviews.length === 0) {
      return res.status(200).json({ message: 'No recommendations available yet.' });
    }

    // Extract liked genres and authors
    const likedGenres = [...new Set(userReviews.map((review) => review.Book.genre))];
    const likedAuthors = [...new Set(userReviews.map((review) => review.Book.author))];

    // Step 2: Find books in the same genres and by the same authors, excluding books the user has already reviewed
    const likedBookIds = userReviews.map((review) => review.Book.id);

    const recommendedBooks = await Book.findAll({
      where: {
        id: { [Op.notIn]: likedBookIds }, // Exclude already reviewed books
        [Op.or]: [
          { genre: { [Op.in]: likedGenres } },
          { author: { [Op.in]: likedAuthors } },
        ],
      },
      limit: 10, // Limit the number of recommendations
    });

    res.status(200).json(recommendedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Recommend books based on a specific book (e.g., "Users who liked this book also liked...")
 */
exports.recommendByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate if the book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Step 1: Find users who reviewed this book positively (4 or 5 stars)
    const positiveReviews = await Review.findAll({
      where: { bookId, rating: { [Op.gte]: 4 } },
    });

    const userIds = positiveReviews.map((review) => review.userId);

    // Step 2: Find other books these users have reviewed positively
    const recommendedBooks = await Book.findAll({
      where: {
        id: { [Op.not]: bookId },
        '$Reviews.rating$': { [Op.gte]: 4 },
        '$Reviews.userId$': { [Op.in]: userIds },
      },
      include: [{ model: Review, attributes: [] }],
      group: ['Book.id'],
      limit: 10, // Limit the number of recommendations
    });

    res.status(200).json(recommendedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
