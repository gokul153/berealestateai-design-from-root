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
    <div style={{ height: "74vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="shadow-lg rounded-4 overflow-hidden bg-white" style={{ width: "60%" }} >
        <div className="row g-0">
          <div className="col-md-6 d-none d-md-flex">
            <div className="w-100 d-flex align-items-center justify-content-center" >
              <img
                src="public/Blue-logo-final.png"
                alt="BeRealEstate AI"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }} />
            </div>
          </div>

          {/* RIGHT SIDE – SIGN UP FORM */}
          <div className="col-md-6 d-flex align-items-center justify-content-center p-5">
            <div style={{ width: "100%", maxWidth: "360px" }}>

              <h3 className="fw-bold mb-1">BeRealEstate AI 🌆</h3>
              <p className="text-muted mb-4">Create your account to get started</p>

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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading} >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/signin" className="fw-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}
