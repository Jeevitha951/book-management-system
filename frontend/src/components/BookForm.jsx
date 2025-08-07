import React, { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/BookForm.css';

const BookForm = ({ onBookAdded, editingBook, onDoneEditing }) => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    publishedYear: '',
    category: '', // ✅ Add category here
  });

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        author: editingBook.author,
        description: editingBook.description,
        publishedYear: editingBook.publishedYear,
        category: editingBook.category || '', // ✅ Load existing category
      });
    } else {
      setForm({ title: '', author: '', description: '', publishedYear: '', category: '' });
    }
  }, [editingBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, form);
        alert('Book updated successfully!');
        onDoneEditing();
      } else {
        await api.post('/books', form);
        alert('Book added successfully!');
      }

      setForm({ title: '', author: '', description: '', publishedYear: '', category: '' });
      onBookAdded();
    } catch (err) {
      console.error('Failed to submit book:', err);
      alert('Submission failed.');
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h3>{editingBook ? 'Edit Book' : 'Add a New Book'}</h3>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />

      <input
        type="text"
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />

      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        type="number"
        name="publishedYear"
        value={form.publishedYear}
        onChange={handleChange}
        placeholder="Published Year"
      />

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
      />

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>

        {editingBook && (
          <button type="button" onClick={onDoneEditing} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;

