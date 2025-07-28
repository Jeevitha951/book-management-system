const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createBook = async (req, res) => {
  const { title, author, description, publishedYear } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  try {
    const book = new Book({
      title,
      author,
      description,
      publishedYear,
      createdBy: req.user._id,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book' });
  }
};

const updateBook = async (req, res) => {
  const { title, author, description, publishedYear } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.publishedYear = publishedYear || book.publishedYear;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
};

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
