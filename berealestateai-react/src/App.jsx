import React from "react";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />
      {/* Example page content */}
      <main style={{ padding: "40px", fontFamily: "Inter, Arial, sans-serif" }}>
        <h1>Welcome to BeRealEstateAI</h1>
        <p>Start building your site below the navbar.</p>
      </main>
    </div>
  );
}
