import React, { useState } from "react";
import Logo from "./Logo";
import PostPropertyModal from "./PostPropertyModal";

export default function Navbar() {
  const [pref, setPref] = useState("Buy");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <>
      <header className="nav-root">
        <div className="nav-top container-fluid d-flex align-items-center justify-content-between flex-wrap">
          {/* Left Section */}
          <div className="nav-left d-flex align-items-center">
            <Logo />
          </div>

          {/* Center Section */}
          <div className="nav-center d-flex align-items-center flex-grow-1 justify-content-center flex-wrap">
            <div className="selector d-flex align-items-center me-3">
              <button
                className={`sel-btn ${pref === "Buy" ? "active" : ""}`}
                onClick={() => setPref("Buy")}
              >
                Buy
              </button>
              <button
                className={`sel-btn ${pref === "Rent" ? "active" : ""}`}
                onClick={() => setPref("Rent")}
              >
                Rent
              </button>
            </div>

            <div className="search-wrap d-flex align-items-center">
              <input
                className="search-input form-control"
                placeholder="Enter property type, location, or project"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="icon-btn ms-2"
                title="Near me"
                onClick={() => alert("Finding nearby...")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="#004E8F" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" stroke="#004E8F" strokeWidth="1.5" />
                </svg>
              </button>
              <button
                className="search-btn ms-2"
                onClick={() => alert(`Searching: ${query} (${pref})`)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="nav-right d-flex align-items-center">
            <button className="post-btn me-2" onClick={() => setShowPostModal(true)}>
              Post property <span className="free">FREE</span>
            </button>
            <button className="user-btn me-2" title="Profile">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" stroke="#fff" strokeWidth="1.5" />
                <path d="M4 20c1.6-5 6.4-7 8-7s6.4 2 8 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Hamburger for Mobile */}
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
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs border-top">
          <ul className="d-flex justify-content-center flex-wrap list-unstyled m-0 py-2">
            <li className="tab active px-3">Overview</li>
            <li className="tab px-3">Prices</li>
            <li className="tab px-3">Reviews</li>
            <li className="tab px-3">Societies & Properties</li>
          </ul>
          <div className="see-all text-center pb-2">
            <button className="see-all-btn">See all 200+ Properties</button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu bg-light p-3">
            <a href="#">Post Property</a>
            <a href="#">Home Loans</a>
            <a href="#">Insights</a>
            <a href="#">Articles</a>
          </div>
        )}
      </header>

      <PostPropertyModal show={showPostModal} handleClose={() => setShowPostModal(false)} />
    </>
  );
}
