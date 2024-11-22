import React from 'react';

const Toast = ({ message, type }) => {
  const getClassnames = () => {
    if (type === 'success') return 'bg-green-500';
    if (type === 'error') return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white ${getClassnames()}`}>
      {message}
    </div>
  );
};

export default Toast;
