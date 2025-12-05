import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  //todo need to design the sign up page
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !mobileNumber || !password) {
      setError("All fields are required.");
      return false;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid.");
      return false;
    }
    // Basic mobile number validation (10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Mobile number must be 10 digits.");
      return false;
    }
    // Basic password validation (minimum 8 characters)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/signup`, {
     
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          mobile_number: mobileNumber,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Sign up failed");
      }

      // On success, navigate to the sign-in page
      navigate("/signin");

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
          <h2>Sign Up</h2>
          <p>Create your account to get started.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="mb-3"><input type="tel" className="form-control" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} /></div>
            <div className="mb-3"><input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
