import React from "react";


import Navbar from "./components/navbar";

import PropertyList from "./components/PropertyList";
import PropertyCategories from "./components/propertyCategories";
export default function App() {
  return (
    <div>
       <Navbar />

      {/* Example page content */}
      <main style={{ padding: "40px", fontFamily: "Inter, Arial, sans-serif" }}>
        <h1>Welcome to BeRealEstateAI</h1>
        <p>Start your Real Journey with Us</p>
        <PropertyCategories>  </PropertyCategories>
        <PropertyList></PropertyList>
      </main>
    </div>
  );
}
