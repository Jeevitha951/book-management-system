import React, { useEffect, useState } from 'react';
import api from '../api/api';
import BookForm from './BookForm';
import { getUserRole } from '../utils/getUserRole';
import '../styles/BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const role = getUserRole();

  const fetchBooks = async () => {
    try {
      const params = { page, limit };
      if (titleFilter) params.title = titleFilter;
      if (authorFilter) params.author = authorFilter;
      if (yearFilter) params.year = yearFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await api.get('/books', { params });
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, limit]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchBooks();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [titleFilter, authorFilter, yearFilter, categoryFilter]);

  const deleteBook = (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchBooks())
      .catch((err) => console.error('Delete failed:', err));
  };

  const startEdit = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stopEditing = () => {
    setEditingBook(null);
  };

  return (
    <div className="booklist-container">
      <h2 className="booklist-heading">📚 Book List</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-input">
          <input
            type="text"
            placeholder="Search by Title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
          {titleFilter && (
            <span className="clear-btn" onClick={() => setTitleFilter('')}>
              &times;
            </span>
          )}
        </div>

        <div className="filter-input">
          <input
            type="text"
            placeholder="Filter by Author"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />
          {authorFilter && (
            <span className="clear-btn" onClick={() => setAuthorFilter('')}>
              &times;
            </span>
          )}
        </div>

        <div className="filter-input">
          <input
            type="number"
            placeholder="Filter by Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          />
          {yearFilter && (
            <span className="clear-btn" onClick={() => setYearFilter('')}>
              &times;
            </span>
          )}
        </div>

        <div className="filter-input">
          <input
            type="text"
            placeholder="Filter by Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
          {categoryFilter && (
            <span className="clear-btn" onClick={() => setCategoryFilter('')}>
              &times;
            </span>
          )}
        </div>
      </div>

      {/* Book List */}
      {books.length === 0 ? (
        <p className="no-books">No books available</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book._id} className="book-item">
              <div className="book-info">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                {book.description && <p>{book.description}</p>}
                {book.category && (
                  <p><strong>Category:</strong> {book.category}</p>
                )}
                {book.publishedYear && (
                  <p><small>📅 {book.publishedYear}</small></p>
                )}
              </div>

              {role === 'admin' && (
                <div className="book-actions">
                  <button className="edit-btn" onClick={() => startEdit(book)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteBook(book._id)}>
                    🗑️ Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <label style={{ marginRight: '10px' }}>
          Show{' '}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>{' '}
          books per page
        </label>

        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          ◀ Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next ▶
        </button>
      </div>

      <hr className="separator" />

      {role === 'admin' ? (
        <BookForm
          onBookAdded={fetchBooks}
          editingBook={editingBook}
          onDoneEditing={stopEditing}
        />
      ) : (
        <p className="admin-info">
          <i>Only admin users can add or edit books.</i>
        </p>
      )}
    </div>
  );
};

export default BookList;
