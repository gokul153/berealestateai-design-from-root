import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarActions";

export default function Navbar({ isAuthenticated, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          />
        </div>
      </div>

      {/* Desktop Search */}
      <div className="desktop-only nav-search">
        <NavbarSearch />
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <NavbarSearch />

          <Link to="/post-property">Post Property</Link>
          <a href="#">Home Loans</a>
          <a href="#">Insights</a>
          <a href="#">Articles</a>

          {isAuthenticated && (
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
