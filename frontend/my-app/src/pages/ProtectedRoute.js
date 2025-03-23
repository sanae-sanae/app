import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppSelector((state) => {
    console.log('ProtectedRoute - Raw state:', state);
    return state.auth;
  });

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;