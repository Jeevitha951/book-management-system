const Book = require('../models/Book');

// @desc    Get all books with optional filters + pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  console.log("GET /api/books called");

  try {
    const { title, author, year, category, page = 1, limit = 5 } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    if (year) {
      query.publishedYear = Number(year);
    }

    if (category) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(Number(limit));

    console.log('Pagination Debug:', {
      query,
      page,
      limit,
      skip,
      totalBooks,
      returnedCount: books.length,
    });

    res.json({
      books,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / Number(limit)),
      totalBooks,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private (admin)
const createBook = async (req, res) => {
  const { title, author, description, publishedYear, category } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  try {
    const book = new Book({
      title,
      author,
      description,
      publishedYear,
      category,
      createdBy: req.user._id,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (admin)
const updateBook = async (req, res) => {
  const { title, author, description, publishedYear, category } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.publishedYear = publishedYear || book.publishedYear;
    book.category = category || book.category;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (admin)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
