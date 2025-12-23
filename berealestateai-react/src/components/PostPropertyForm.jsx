import React from "react";
import "./PostPropertyForm.css";

const PostPropertyForm = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4 fw-bold">Post Your Property</h2>
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form>
                <div className="form-section">
                  <h5>Property Information</h5>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Property Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Enter property title" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" rows="3" placeholder="Describe your property"></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h5>Price & Location</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">Price</label>
                      <input type="number" className="form-control" id="price" placeholder="Amount" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">City</label>
                      <input type="text" className="form-control" id="city" placeholder="City" />
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button type="submit" className="btn btn-primary px-4">Post Property</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPropertyForm;