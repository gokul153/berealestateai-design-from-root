import React, { useState } from "react";
import { Link } from "react-router-dom";
import PostPropertyModal from "./PostPropertyModal";

const NavbarActions = ({ isAuthenticated, onLogout }) => {
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <>
      <div className="nav-right d-flex align-items-center">
        {isAuthenticated ? (
          <>
            <button className="post-btn me-3" onClick={() => setShowPostModal(true)}>
              Post property <span className="free">FREE</span>
            </button>
            <button className="btn btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </>
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

      {/* The modal is kept here to be controlled by the "Post property" button */}
      <PostPropertyModal show={showPostModal} handleClose={() => setShowPostModal(false)} />
    </>
  );
};

export default NavbarActions;
