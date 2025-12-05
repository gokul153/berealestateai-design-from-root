import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/navbar";
import PropertyList from "./components/PropertyList";
import PropertyCategories from "./components/propertyCategories";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";

export default function App() {
  // Check for token in localStorage to see if user is already logged in
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <main style={{ padding: "40px", fontFamily: "Inter, Arial, sans-serif" }}>
                <h1>Welcome to BeRealEstateAI</h1>
                <p>Start your Real Journey with Us</p>
                <PropertyCategories />
                <PropertyList />
              </main>
            ) : (
              <Navigate to="/signin" />
            )
          } 
        />
      </Routes>
    </div>
  );
}
