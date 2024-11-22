const Book = require('../models/book');
const Review = require('../models/review');
const cloudinary = require('../config/cloudinary');
const { Op } = require('sequelize');

/**
 * Add a new book
 */
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, isbn } = req.body;

    // Upload cover image to Cloudinary if file is provided
    let coverImage = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      coverImage = result.secure_url;
    }

    const book = await Book.create({ title, author, genre, isbn, coverImage });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Edit an existing book
 */
exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, isbn } = req.body;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Update cover image if a new file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      book.coverImage = result.secure_url;
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.isbn = isbn || book.isbn;

    await book.save();
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete a book
 */
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.destroy();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Search books by title, author, or ISBN
 */
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { author: { [Op.iLike]: `%${query}%` } },
          { isbn: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get a single book by ID
 */
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: [
        {
          model: Review,
          attributes: ['rating', 'comment', 'userId'],
        },
      ],
    });

    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * List all books with sorting, filtering, and pagination
 */
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'title', order = 'ASC', genre } = req.query;

    const filter = genre ? { genre } : {};

    const books = await Book.findAndCountAll({
      where: filter,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
    });

    res.status(200).json({
      total: books.count,
      pages: Math.ceil(books.count / limit),
      currentPage: parseInt(page, 10),
      data: books.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
