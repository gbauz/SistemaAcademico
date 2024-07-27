import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirectPath = '/', children }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }
  return children;
};

export default ProtectedRoute;
