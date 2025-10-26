import React, { useState } from "react";
import Logo from "./Logo";



export default function Navbar() {
  const [pref, setPref] = useState("Buy");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nav-root">
      <div className="nav-top">
        <div className="nav-left">
            <Logo />
        </div>

        <div className="nav-center">
          <div className="selector">
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

          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Enter which type of property, location, or project"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-icons">
              <button className="icon-btn" title="Near me">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v2" stroke="#004E8F" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 20v2" stroke="#004E8F" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 12h2" stroke="#004E8F" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M20 12h2" stroke="#004E8F" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="4" stroke="#004E8F" strokeWidth="1.5"/>
                </svg>
              </button>

            

              <button className="search-btn" onClick={() => alert(`Searching: ${query} (${pref})`)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="nav-right">
          <button className="post-btn">Post property <span className="free">FREE</span></button>
          <button className="user-btn" title="Profile">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3" stroke="#fff" strokeWidth="1.5"/>
              <path d="M4 20c1.6-5 6.4-7 8-7s6.4 2 8 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="menu">
            <div className="hb-line" />
            <div className="hb-line" />
            <div className="hb-line" />
          </button>
        </div>
      </div>

      <nav className="nav-tabs">
        <ul>
          <li className="tab active">Overview</li>
          <li className="tab">Prices</li>
          <li className="tab">Reviews</li>
          <li className="tab">Societies & Properties</li>
        </ul>

        <div className="see-all">
          <button className="see-all-btn">See all 200+ Properties</button>
        </div>
      </nav>

      {/* mobile menu (simple slide down) */}
      {mobileOpen && (
        <div className="mobile-menu">
          <a href="#">Post Property</a>
          <a href="#">Home Loans</a>
          <a href="#">Insights</a>
          <a href="#">Articles</a>
        </div>
      )}
    </header>
  );
}
