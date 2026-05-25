import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center text-white">Loading...</p>; // Show while checking auth state

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
