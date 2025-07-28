import React, { useEffect, useState } from 'react';
import api from '../api/api';
import BookForm from './BookForm';
import { getUserRole } from '../utils/getUserRole';
import '../styles/BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const role = getUserRole();

  const fetchBooks = () => {
    api.get('/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchBooks())
      .catch(err => console.error('Delete failed:', err));
  };

  const startEdit = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stopEditing = () => {
    setEditingBook(null);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="booklist-container">
      <h2 className="booklist-heading">📚 Book List</h2>

      {books.length === 0 ? (
        <p className="no-books">No books available</p>
      ) : (
        <ul className="book-list">
          {books.map(book => (
            <li key={book._id} className="book-item">
              <div className="book-info">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                {book.description && <p>{book.description}</p>}
                {book.publishedYear && <p><small>📅 {book.publishedYear}</small></p>}
              </div>

              {role === 'admin' && (
                <div className="book-actions">
                  <button className="edit-btn" onClick={() => startEdit(book)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => deleteBook(book._id)}>🗑️ Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <hr className="separator" />

      {role === 'admin' ? (
        <BookForm
          onBookAdded={fetchBooks}
          editingBook={editingBook}
          onDoneEditing={stopEditing}
        />
      ) : (
        <p className="admin-info"><i>Only admin users can add or edit books.</i></p>
      )}
    </div>
  );
};

export default BookList;
