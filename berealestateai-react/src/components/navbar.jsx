import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarActions";
import PostPropertyModal from "./PostPropertyModal";

export default function Navbar({ isAuthenticated, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (isAuthenticated) {
      setShowPostModal(true);
    } else {
      navigate("/signin");
    }
  };

  return (
    <header className="nav-root">
      {/* Top Bar */}
      <div className="nav-top container-fluid">
        {/* Left */}
        <div className="nav-left">
          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Center (Logo / Brand) */}
        <div className="nav-center">
          <span className="brand">BeRealEstateAI</span>
        </div>

        {/* Right (Desktop only) */}
        <div className="nav-right desktop-only">
          <NavbarActions
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
            onPostClick={handlePostClick}
          />
        </div>
      </div>

      {/* Desktop Search */}
      <div className="desktop-only nav-search">
        <NavbarSearch />
      </div>
      <div className="nav-links">
  <a href="#" onClick={(e) => { e.preventDefault(); handlePostClick(); }}>
    Post Property <span className="free">FREE</span>
  </a>
  <a href="#">Manage Ads</a>
  <Link to="/ai-ad-generate">AI Ad Generate</Link>
  <a href="#">Insights</a>
  <a href="#">Articles</a>
</div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <NavbarSearch />

          <a href="#" onClick={(e) => { e.preventDefault(); handlePostClick(); }}>
            Post Property <span className="free">FREE</span>
          </a>
          <a href="#">Manage Adds</a>
          <Link to="/ai-ad-generate" onClick={() => setMobileOpen(false)}>AI Ad Generate</Link>
          <a href="#">Insights</a>
          <a href="#">Articles</a>

          {!isAuthenticated && (
            <>
              <Link to="/signin">Sign In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}

          {isAuthenticated && (
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      )}

      {/* The modal is kept here to be controlled by the "Post property" button */}
      <PostPropertyModal show={showPostModal} handleClose={() => setShowPostModal(false)} />
    </header>
  );
}
