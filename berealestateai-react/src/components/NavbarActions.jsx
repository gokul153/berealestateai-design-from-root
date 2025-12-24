import React from "react";
import { Link } from "react-router-dom";

const NavbarActions = ({ isAuthenticated, onLogout, onPostClick }) => {
  return (
    <>
      <div className="nav-right d-flex align-items-center">
        <button className="post-btn me-3" onClick={onPostClick}>
          Post property <span className="free">FREE</span>
        </button>
        {isAuthenticated ? (
          <button className="btn btn-outline-light" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/signin" className="btn btn-outline-light me-2">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default NavbarActions;
