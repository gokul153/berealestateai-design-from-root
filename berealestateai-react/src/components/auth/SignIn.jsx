import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn({ onLoginSuccess }) {
  const [username, setUsername] = useState(""); // API expects 'username'
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //todo need to design the sign in page
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const details = {
        username: username,
        password: password,
      };

      const formBody = Object.keys(details)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
        .join('&');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Sign in failed");
      }

      const data = await response.json();
      console.log("Login Response:", data); // Logging the response as requested
      
      // Store token and update app state
      sessionStorage.setItem("accessToken", data.access_token);
      onLoginSuccess();
      
      // Navigate to the main app page
      navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Sign In</h2>
          <p>Welcome back! Please enter your details.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><input type="email" className="form-control" placeholder="Email (as username)" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
            <div className="mb-3"><input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <div className="mb-3 text-end">
              <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
          </form>
           <p className="mt-3 text-center">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
