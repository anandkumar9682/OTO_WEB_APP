// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  // If there is no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Otherwise, render the requested “protected” component
  return children;
}
