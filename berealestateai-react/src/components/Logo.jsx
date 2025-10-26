import React from 'react';

const Logo = () => {
  // Define base size - adjust this one value to scale the logo
  const logoSize = 40; // Example size in pixels, good for a navbar

  return (
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        width={logoSize}
        height={logoSize}
        viewBox="0 0 100 100" // Keep viewBox large for coordinate system
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle
        <circle cx="50" cy="50" r="48" fill="#004E8F" />

        {/* Outer Circles (like the original design) */}
        {/* <circle cx="50" cy="50" r="46" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#FFFFFF" strokeWidth="1.5" /> */} 

        {/* --- Logo Content --- */}
        {/* Removed House Icon */}
        {/* Removed Star Icon */}

        {/* Main Text: BeRealEstateAi */}
        {/* Increased font size and simplified 'Ai' color */}
        <text
          x="50%"
          y="50%" // Center vertically now
          textAnchor="middle"
          dy=".3em" // Standard vertical centering adjustment
          fill="#FFF" // Default white
          fontSize="13" // Increased font size from 12 to 14
          fontWeight="bold"
          fontFamily="Arial, sans-serif" // Match navbar font if possible
        >
          BeRealEstate
          <tspan fill="#FFF" dx="1">Ai</tspan> {/* Changed Ai color to white for simplicity */}
        </text>

        {/* Removed Sub Text */}
      </svg>
    </div>
  );
};

export default Logo;

