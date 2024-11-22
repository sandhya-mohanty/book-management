const express = require('express');
const {
  addBook,
  editBook,
  deleteBook,
  searchBooks,
  getBookById,
  getBooks,
} = require('../controllers/bookController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// const upload = require('../middleware/uploadMiddleware'); // For image uploads

const router = express.Router();

router.post('/', authenticate, upload.single('coverImage'), addBook);
router.put('/:id', authenticate, upload.single('coverImage'), editBook);
router.delete('/:id', authenticate, deleteBook);
router.get('/search', searchBooks);
router.get('/:id', getBookById);
router.get('/', getBooks);

module.exports = router;
