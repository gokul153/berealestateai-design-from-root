import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h3 className="card-title mb-3">Write to us, we value you</h3>
              <p className="card-text">
                Currently we have some restriction on forget password.
              </p>
              <p className="card-text">
                Please send us an email @ <a href="mailto:supportberealestateai@gmail.com" className="fw-bold text-decoration-none">supportberealestateai@gmail.com</a>
              </p>
              <div className="mt-4">
                <Link to="/signin" className="btn btn-outline-primary">Back to Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}