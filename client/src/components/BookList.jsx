// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import API from '../utils/api';

// const BookList = () => {
//   const [books, setBooks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [genre, setGenre] = useState('');
//   const [rating, setRating] = useState('');
//   const [filteredBooks, setFilteredBooks] = useState([]);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const { data } = await API.get('/books', { params: { page: currentPage } });
//         setBooks(data.books);
//         setTotalPages(data.totalPages);
//       } catch (error) {
//         alert('Error fetching books');
//       }
//     };

//     fetchBooks();
//   }, [currentPage]);

//   useEffect(() => {
//     const filtered = books.filter((book) => {
//       return (
//         (!genre || book.genre === genre) &&
//         (!rating || book.averageRating >= rating)
//       );
//     });
//     setFilteredBooks(filtered);
//   }, [books, genre, rating]);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="flex space-x-4 mb-6">
//         <select
//           value={genre}
//           onChange={(e) => setGenre(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="">All Genres</option>
//           <option value="Fiction">Fiction</option>
//           <option value="Non-fiction">Non-fiction</option>
//           <option value="Mystery">Mystery</option>
//         </select>
//         <select
//           value={rating}
//           onChange={(e) => setRating(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="">All Ratings</option>
//           <option value="4">4 Stars & Above</option>
//           <option value="3">3 Stars & Above</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredBooks.map((book) => (
//           <div key={book.id} className="bg-white p-6 rounded shadow-md">
//             <img
//               src={book.coverImage}
//               alt={book.title}
//               className="w-48 h-72 object-cover mb-4"
//             />
//             <h3 className="text-xl font-semibold">{book.title}</h3>
//             <p className="text-gray-600">{book.author}</p>
//             <p className="text-yellow-500">{'⭐'.repeat(book.averageRating)}</p>
//             <div className="mt-4 flex justify-between">
//               <Link to={`/book/${book.id}`} className="text-blue-500">
//                 View Details
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 flex justify-between">
//         <button
//           onClick={prevPage}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={currentPage === 1}
//         >
//           Prev
//         </button>
//         <button
//           onClick={nextPage}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookList;





import React, { useState, useEffect } from 'react';
import API from '../utils/api';
// import BookForm from './BookForm';
import BookDetail from './BookDetail';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await API.get('/books', {
          params: { search, sortBy, page: currentPage },
        });
        setBooks(data);
      } catch (error) {
        alert('Error fetching books');
      }
    };
    fetchBooks();
  }, [search, sortBy, currentPage]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      alert('Error deleting book');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBook(null);
    setCurrentPage(1); // Reload the first page
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search books..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close Form' : 'Add Book'}
        </button>
      </div>

      {showForm && (
        <BookDetail book={editingBook} onSuccess={handleFormSuccess} />
      )}

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Genre</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.genre}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => {
                    setEditingBook(book);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
