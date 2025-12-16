import React, { useState } from "react";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarActions";

export default function Navbar({ isAuthenticated, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nav-root">
      <div className="nav-top container-fluid d-flex align-items-center justify-content-between flex-wrap">
        {/* Left Section */}
        {/* <div className="nav-left d-flex align-items-center">
          <Logo />
        </div> */}

        {/* Center Section (Refactored) */}
        <NavbarSearch />

        {/* Right Section (Refactored) */}
        <NavbarActions isAuthenticated={isAuthenticated} onLogout={onLogout} />

        {/* Hamburger for Mobile (remains for layout control) */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="menu"
        >
          <div className="hb-line" />
          <div className="hb-line" />
          <div className="hb-line" />
        </button>
      </div>

      {/* Mobile Menu can be further refactored if it grows in complexity */}
      {mobileOpen && (
        <div className="mobile-menu bg-light p-3">
          <a href="#">Post Property</a>
          <a href="#">Home Loans</a>
          <a href="#">Insights</a>
          <a href="#">Articles</a>
        </div>
      )}
    </header>
  );
}
