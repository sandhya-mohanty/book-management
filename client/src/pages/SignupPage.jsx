import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await API.post('/auth/signup', formData);
  //     if (response.data.success) {
  //       navigate('/login');
  //     }
  //   } catch (err) {
  //     setError('Sign-up failed. Please try again.');
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!formData.username || !formData.email || !formData.password) {
  //     setError('All fields are required.');
  //     return;
  //   }
  
  //   try {
  //     console.log('Submitting Form Data:', formData); // Debugging
  //     const response = await API.post('/auth/signup', formData);
  
  //     if (response.data.success) {
  //       navigate('/login');
  //     } else {
  //       setError('Unexpected error occurred.');
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.error || 'Sign-up failed. Please try again.');
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Client-Side Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address.');
      return;
    }
  
    try {
      console.log('Submitting Form Data:', formData);
      const response = await API.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(formData),

      });
      
      
  
      if (response.data.success) {
        navigate('/login');
      } else {
        setError('Unexpected error occurred.');
      }
    } catch (err) {
      console.error('Error Response:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Sign-up failed. Please try again.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center">Sign Up</h2>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="username" className="block text-lg">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-lg">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
