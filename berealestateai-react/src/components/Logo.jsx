import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  // Define base size - adjust this one value to scale the logo
  const logoSize = 40; // Example size in pixels, good for a navbar

  return (
    <Link to="/" className="logo-container d-flex align-items-center text-decoration-none">
      <img
        src="/logo.png" // This path assumes your logo is in the `public` folder
        alt="BeRealEstateAI Logo"
        style={{ height: logoSize, width: 'auto' }}
      />
      <span className="ms-2 fw-bold text-white fs-5" style={{lineHeight: 1}}>BeRealEstateAi</span>
    </Link>
  );
};

export default Logo;

