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
    <div style={{height: "74vh", display: "flex",justifyContent: "center",alignItems: "center"}}>
      <div className="shadow-lg rounded-4 overflow-hidden bg-white"style={{ width: "60%" }}>
        <div className="row g-0">
          <div className="col-md-6 d-none d-md-flex">
            <div className="w-100 d-flex align-items-center justify-content-center">
              <img src="public/Blue-logo-final.png" alt="BeRealEstate AI"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center justify-content-center p-5">
            <div style={{ width: "100%", maxWidth: "360px" }}>
              <h3 className="fw-bold mb-1">BeRealEstate AI <span role="img">🌆</span></h3>
              <p className="text-muted mb-4">Sign in to continue</p>

              {error && (
                <div className="alert alert-danger">
                  Invalid credentials
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3 text-end">
                  <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                </div>

                <button type="submit"className="btn btn-primary btn-lg w-100">
                  Sign In
                </button>
              </form>

              <p className="mt-4 text-center">
                Don’t have an account?{" "}
                <Link to="/signup" className="fw-semibold">
                  Sign Up
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>

  );
}
