import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/navbar";
import PropertyListPremium from "./components/PropertyList";
import PropertyCategories from "./components/propertyCategories";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import PropertyListAll from "./components/PropertyListRecent";
import PropertyDetails from "./components/CommonPropertyDetail";
import PostPropertyForm from "./components/PostPropertyForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import AIAdGenerate from "./components/AIAdGenerate";

export default function App() {
  // Check for token in sessionStorage to see if user is already logged in
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route
          path="/"
          element={
            <main style={{ padding: "40px", fontFamily: "Inter, Arial, sans-serif" }}>
              <h1>Welcome to BeRealEstateAI</h1>
              <p>Start your Real Estate Journey with Us</p>
              <PropertyCategories />
              <PropertyListPremium />
              <PropertyListAll />
            </main>
          }
        />
        {/* Example of a protected route for posting an ad */}
        <Route
          path="/post-property"
          element={
            isAuthenticated ? (
              <PostPropertyForm />
            ) : (
              <Navigate to="/signin" state={{ from: "/post-property", message: "Please login to post a property" }} />
            )
          }
        />
        <Route
          path="/ai-ad-generate"
          element={
            isAuthenticated ? (
              <AIAdGenerate />
            ) : (
              <Navigate to="/signin" state={{ from: "/ai-ad-generate", message: "Please login to generate AI ads" }} />
            )
          }
        />
      </Routes>
    </div>
  );
}
