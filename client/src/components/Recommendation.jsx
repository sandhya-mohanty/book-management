import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Recommendation = ({ bookId }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await API.get(`/recommendations?bookId=${bookId}`);
        setRecommendedBooks(data);
      } catch (error) {
        alert('Error fetching recommendations');
      }
    };
    fetchRecommendations();
  }, [bookId]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Recommendations</h2>
      {recommendedBooks.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        <ul>
          {recommendedBooks.map((book) => (
            <li key={book.id} className="flex justify-between items-center py-2">
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p>{book.author}</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                View Book
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recommendation;
