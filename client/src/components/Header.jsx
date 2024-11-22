import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Book Store
        </Link>
        <nav>
          {user ? (
            <>
              <span className="mr-4">{user.username}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 text-white">Login</Link>
              <Link to="/signup" className="text-white">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
