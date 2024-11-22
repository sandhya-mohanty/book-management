// import React, { useState } from 'react';
// import API from '../utils/api';

// const ReviewForm = ({ bookId, onReviewSubmit }) => {
//   const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setReviewData({ ...reviewData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await API.post(`/reviews/${bookId}`, reviewData);
//       if (response.data.success) {
//         onReviewSubmit();
//         setReviewData({ rating: 5, comment: '' });
//       }
//     } catch (err) {
//       setError('Failed to submit review. Please try again.');
//     }
//   };

//   return (
//     <div className="p-8">
//       <h3 className="text-xl font-semibold">Write a Review</h3>
//       {error && <p className="text-red-500">{error}</p>}
//       <form onSubmit={handleSubmit} className="mt-4">
//         <div className="mb-4">
//           <label htmlFor="rating" className="block text-lg">Rating (1-5)</label>
//           <input
//             type="number"
//             id="rating"
//             name="rating"
//             value={reviewData.rating}
//             onChange={handleInputChange}
//             min="1"
//             max="5"
//             className="w-full p-3 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="comment" className="block text-lg">Comment</label>
//           <textarea
//             id="comment"
//             name="comment"
//             value={reviewData.comment}
//             onChange={handleInputChange}
//             className="w-full p-3 border rounded"
//             required
//           />
//         </div>
//         <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
//           Submit Review
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ReviewForm;




import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const ReviewForm = ({ bookId, review, onSuccess }) => {
  const [rating, setRating] = useState(review ? review.rating : 1);
  const [text, setText] = useState(review ? review.text : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { rating, text };

    try {
      if (review) {
        await API.put(`/reviews/${review.id}`, data);
      } else {
        await API.post('/reviews', { ...data, bookId });
      }
      onSuccess();
    } catch (error) {
      alert('Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">{review ? 'Edit Review' : 'Add Review'}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          className="w-full p-3 border rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Review Text</label>
        <textarea
          className="w-full p-3 border rounded"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button className="bg-blue-500 text-white py-2 px-4 rounded w-full">
        {review ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
