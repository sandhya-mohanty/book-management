// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import BookDetail from '../components/BookDetail';
// import ReviewForm from '../components/ReviewForm';
// import API from '../utils/api';

// const BookDetailsPage = () => {
//   const { id } = useParams();
//   const [book, setBook] = useState(null);
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         const bookResponse = await API.get(`/books/${id}`);
//         setBook(bookResponse.data);

//         const reviewsResponse = await API.get(`/reviews/${id}`);
//         setReviews(reviewsResponse.data);
//       } catch (error) {
//         console.error('Error fetching book details or reviews:', error);
//       }
//     };

//     fetchBookDetails();
//   }, [id]);

//   const handleReviewSubmit = async () => {
//     const reviewsResponse = await API.get(`/reviews/${id}`);
//     setReviews(reviewsResponse.data);
//   };

//   if (!book) return <div>Loading...</div>;

//   return (
//     <div>
//       <BookDetail book={book} />
//       <ReviewForm bookId={id} onReviewSubmit={handleReviewSubmit} />
//       <h3 className="text-xl font-semibold mt-8">Reviews</h3>
//       <div className="mt-4">
//         {reviews.map((review) => (
//           <div key={review.id} className="mb-4 p-4 border rounded">
//             <p>{'⭐'.repeat(review.rating)}</p>
//             <p>{review.comment}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookDetailsPage;



import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import ReviewForm from '../components/ReviewForm';
// import ReviewForm from './ReviewForm';

const BookDetailPage = ({ match }) => {
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get(`/books/${match.params.id}`);
        setBook(data);
      } catch (error) {
        alert('Error fetching book details');
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/reviews?bookId=${match.params.id}`);
        setReviews(data);
      } catch (error) {
        alert('Error fetching reviews');
      }
    };

    fetchBook();
    fetchReviews();
  }, [match.params.id]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    // Reload the reviews after adding/editing
    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/reviews?bookId=${match.params.id}`);
        setReviews(data);
      } catch (error) {
        alert('Error fetching reviews');
      }
    };
    fetchReviews();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (id) => {
    try {
      await API.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      alert('Error deleting review');
    }
  };

  return (
    <div className="p-8">
      {book && (
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <h3 className="text-xl">{book.author}</h3>
          <p className="mt-4">{book.genre}</p>
          <img src={book.coverImage} alt={book.title} className="mt-4 w-48 h-72 object-cover" />
        </div>
      )}

      <div className="mt-8">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={() => setShowReviewForm(true)}
        >
          Add Review
        </button>
      </div>

      {showReviewForm && (
        <ReviewForm bookId={match.params.id} review={editingReview} onSuccess={handleReviewSuccess} />
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="border-b pb-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{review.rating} Stars</p>
                    <p>{review.text}</p>
                  </div>
                  <div>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;

