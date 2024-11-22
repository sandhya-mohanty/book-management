
import React, { useState } from 'react';
import API from '../utils/api';

const BookDetail = ({ book, onSuccess }) => {
  const [form, setForm] = useState(
    book || { title: '', author: '', isbn: '', genre: '', coverImage: '' }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (book) {
        await API.put(`/books/${book.id}`, form);
      } else {
        await API.post('/books', form);
      }
      onSuccess();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form className="bg-white p-8 rounded shadow-md w-full" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">{book ? 'Edit Book' : 'Add Book'}</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-3 mb-4 border rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        className="w-full p-3 mb-4 border rounded"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />
      <input
        type="text"
        placeholder="ISBN"
        className="w-full p-3 mb-4 border rounded"
        value={form.isbn}
        onChange={(e) => setForm({ ...form, isbn: e.target.value })}
      />
      <input
        type="text"
        placeholder="Genre"
        className="w-full p-3 mb-4 border rounded"
        value={form.genre}
        onChange={(e) => setForm({ ...form, genre: e.target.value })}
      />
      <input
        type="url"
        placeholder="Cover Image URL"
        className="w-full p-3 mb-4 border rounded"
        value={form.coverImage}
        onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
      />
      <button className="bg-blue-500 text-white py-2 px-4 rounded w-full">
        {book ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookDetail;
