import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="d-flex justify-content-center align-items-center"style={{ height: "74vh", backgroundColor: "#f5f7fa" }}>
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "520px", width: "100%" }}>
        <div className="card-body p-5 text-center">

          <h3 className="fw-bold mb-3">Need help with your password?</h3>
          <p className="text-muted mb-4">
            For security reasons, password recovery is currently handled by our
            support team.
          </p>

          <div className="bg-light rounded-3 p-4 mb-4">
            <p className="mb-2 fw-semibold">📩 Contact Support</p>
            <a href="mailto:supportberealestateai@gmail.com"className="fw-bold text-decoration-none fs-6">
              supportberealestateai@gmail.com
            </a>
            <p className="text-muted mt-2 mb-0" style={{ fontSize: "14px" }}>
              Please include your registered email or mobile number.
            </p>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <Link to="/signin" className="btn btn-outline-primary">
              Back to Sign In
            </Link>
            <a href="mailto:supportberealestateai@gmail.com" className="btn btn-primary">
              Email Support
            </a>
          </div>

        </div>
      </div>
    </div>

  );
}