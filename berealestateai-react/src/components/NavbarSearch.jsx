import React, { useState } from "react";

const NavbarSearch = () => {
  const [pref, setPref] = useState("Buy");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for "${query}" to ${pref}`);
  };

  return (
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
        <button className="search-btn ms-2" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NavbarSearch;
