import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostPropertyModal from "./PostPropertyModal";

const NavbarActions = ({ isAuthenticated, onLogout }) => {
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
    <>
      <div className="nav-right d-flex align-items-center">
        <button className="post-btn me-3" onClick={handlePostClick}>
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

      {/* The modal is kept here to be controlled by the "Post property" button */}
      <PostPropertyModal show={showPostModal} handleClose={() => setShowPostModal(false)} />
    </>
  );
};

export default NavbarActions;
