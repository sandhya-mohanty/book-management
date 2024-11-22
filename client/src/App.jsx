import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';
import BookDetail from './components/BookDetail';
import BookList from './components/BookList';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="container mx-auto mt-4">
          <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetailsPage />} /> */}
               <Route exact path="/"element ={<BookList/>} />
               <Route path="/book/:id" element={<BookDetail/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
