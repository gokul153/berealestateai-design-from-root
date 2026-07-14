import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Map the data into URLSearchParams to create standard Form Data
      const formData = new URLSearchParams();
      formData.append("username", email); // Map your 'email' state to the required 'username' key
      formData.append("password", password);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Sign in failed");
      }

      const data = await response.json();

      // Store token and role info in session storage
      sessionStorage.setItem("accessToken", data.access_token);
      sessionStorage.setItem("tokenType", data.token_type);

      const isAdmin = data.is_admin === true;
      if (isAdmin) {
        sessionStorage.setItem("isAdmin", "true");
      } else {
        sessionStorage.removeItem("isAdmin");
      }

      // Notify the parent App component of the login status
      onLoginSuccess(isAdmin);

      // Navigate based on user role
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/"); // Navigate regular users to the homepage
      }

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
              <img src="/Blue-logo-final.png" alt="BeRealEstate AI"
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
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
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

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
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
