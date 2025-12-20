import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/navbar";
import PropertyListPremium from "./components/PropertyList";
import PropertyCategories from "./components/propertyCategories";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import PropertyListAll from "./components/PropertyListRecent";
import PropertyDetails from "./components/CommonPropertyDetail";

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
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <main style={{ padding: "40px", fontFamily: "Inter, Arial, sans-serif" }}>
                <h1>Welcome to BeRealEstateAI</h1>
                <p>Start your Real Estate Journey with Us</p>
                <PropertyCategories />
                <PropertyListPremium />
                <PropertyListAll />
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
