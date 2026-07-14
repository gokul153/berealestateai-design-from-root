import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

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
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard"; // This will serve as the Orders page
import AuditLogs from "./components/admin/AuditLogs";
import LoyaltyPoints from "./components/admin/LoyaltyPoints";
import CustomerOnboarding from "./components/admin/CustomerOnboarding";

export default function App() {
  // Check for token in sessionStorage to see if user is already logged in
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("accessToken"));
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("isAdmin") === "true");
  const navigate = useNavigate();
  const location = useLocation();
  const showMainNavbar = !location.pathname.startsWith('/admin');

  const handleLoginSuccess = (userIsAdmin) => {
    setIsAuthenticated(true);
    setIsAdmin(userIsAdmin);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("tokenType");
    sessionStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/signin");
  };

  return (
    <div>
      {showMainNavbar && <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />}

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
        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/signin" replace />
          }
        >
            <Route index element={<Navigate to="orders" replace />} /> 
            <Route path="orders" element={<AdminDashboard onLogout={handleLogout} />} />
            <Route path="audit-logs" element={<AuditLogs onLogout={handleLogout} />} />
            <Route path="loyalty-points" element={<LoyaltyPoints onLogout={handleLogout} />} />
            <Route path="customer-onboarding" element={<CustomerOnboarding onLogout={handleLogout} />} />
        </Route>
      </Routes>
    </div>
  );
}
