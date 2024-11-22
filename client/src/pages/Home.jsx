import React, { useEffect, useState } from 'react';
import BookList from '../components/BookList';
import API from '../utils/api';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // You could also fetch some data here if necessary
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-8">Welcome to the Book Store</h1>
      <BookList />
    </div>
  );
};

export default Home;
