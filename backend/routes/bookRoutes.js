const express = require('express');
const router = express.Router();

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

const { auth, isAdmin } = require('../middleware/authMiddleware');

router.get('/', auth, getBooks);

router.post('/', auth, isAdmin, createBook);
router.put('/:id', auth, isAdmin, updateBook);
router.delete('/:id', auth, isAdmin, deleteBook);

module.exports = router;
