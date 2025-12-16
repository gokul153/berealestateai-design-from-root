import React, { useState } from "react";
import "./PostPropertyForm.css";

const PostPropertyModal = ({ show, handleClose }) => {
  const initialFormData = {
    title: "Enter the name of the property",
    category: "Villa/House/Apartment/",
    propertyFor: "Sale",
    price: 12500000,
    property_age: 3,
    waterSource: "Bore Well",
    furnishing: "Fully Furnished",
    bedrooms: 0,
    bathrooms: 0,
    noOfBalcony: 0,
    parkingNo: 0,
    buildUpArea: 2600,
    buildUpUnit: "Sq.ft", // from BuildUpUnitEnum
    landArea: 8,
    landUnit: "Cent", // from LandUnitEnum
    description: "Beautiful villa with landscaped garden, modular kitchen, and smart home features.",
    location: {
      city: "Enter your city",
      district: "Enter Your District",
      //todo get from map
      latitude: 12.9698,
      longitude: 77.7499,
      imageUrl: "enter the image url here",
    },
    customerDetails: {
      contactNumber: "please enter your contact number",
      email: "email",
      extraNotes: "Any additional information you'd like to provide",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [roomsAndParkingEnabled, setRoomsAndParkingEnabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoomsParkingToggle = (e) => {
    const isEnabled = e.target.checked;
    setRoomsAndParkingEnabled(isEnabled);
    if (!isEnabled) {
      // Reset the values when the section is disabled
      setFormData(prev => ({
        ...prev,
        bedrooms: 0,
        bathrooms: 0,
        noOfBalcony: 0,
        parkingNo: 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Get the authentication token from session storage
    const authToken = sessionStorage.getItem("accessToken");

    if (!authToken) {
      setError("You must be logged in to post a property.");
      setSubmitting(false);
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/post_add_new`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess("Property posted successfully!");
      console.log("Success:", result);
      // Optionally reset form and close modal
      // setFormData(initialFormData);
      // handleClose();
    } catch (err) {
      setError(err.message);
      console.error("Failed to post property:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Post a New Property</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Basic Details */}
              <div className="form-section">
                <h5>Basic Details</h5>
                <div className="row">
                  <div className="col-md-8 mb-3"><input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="Property Title" required /></div>
                  <div className="col-md-4 mb-3">
                    <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                      <option value="">Select Category...</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Commercial / Industrial Land">Commercial / Industrial Land</option>
                      <option value="Commercial cum Residential">Commercial cum Residential</option>
                      <option value="Commercial Project / Shopping Mall">Commercial Project / Shopping Mall</option>
                      <option value="Flat / Apartment / Pent House">Flat / Apartment / Pent House</option>
                      <option value="For Others">For Others</option>
                      <option value="Gated Colony Plot">Gated Colony Plot</option>
                      <option value="Gated Colony Villa">Gated Colony Villa</option>
                      <option value="Godown / Warehouse / Factory">Godown / Warehouse / Factory</option>
                      <option value="Hospital / School / College">Hospital / School / College</option>
                      <option value="Hotel / Resorts / Guest House / Homestay">Hotel / Resorts / Guest House / Homestay</option>
                      <option value="Independent House / Villa / Bungalow">Independent House / Villa / Bungalow</option>
                      <option value="Office Space / Shops / Showrooms">Office Space / Shops / Showrooms</option>
                      <option value="Plantation / Estate">Plantation / Estate</option>
                      <option value="Plot">Plot</option>
                      <option value="Residential Land / Plot">Residential Land / Plot</option>
                      <option value="Service Apartment">Service Apartment</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <select className="form-select" name="propertyFor" value={formData.propertyFor} onChange={handleChange} required>
                      <option value="Sale">For Sale</option>
                      <option value="Rent">For Rent</option>
                      <option value="PG">PG</option>
                      <option value="Lease">Lease</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3"><input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required /></div>
                  <div className="col-md-4 mb-3"><input type="number" className="form-control" name="property_age" value={formData.property_age} onChange={handleChange} placeholder="Property Age (years)" /></div>
                </div>
              </div>

              {/* Property Features */}
              <div className="form-section">
                <h5>Property Features</h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <select className="form-select" name="furnishing" value={formData.furnishing} onChange={handleChange}>
                      <option value="">Select Furnishing...</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Semi Furnished">Semi Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <select className="form-select" name="waterSource" value={formData.waterSource} onChange={handleChange}>
                      <option value="">Select Water Source...</option>
                      <option value="Municipal/Corporation">Municipal/Corporation</option>
                      <option value="Bore Well">Bore Well</option>
                      <option value="Well">Well</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <select className="form-select" name="waterSource" value={formData.waterSource} onChange={handleChange}>
                      <option value="">Select Water Source...</option>
                      <option value="Municipal/Corporation">Municipal/Corporation</option>
                      <option value="Bore Well">Bore Well</option>
                      <option value="Well">Well</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="enableRoomsParking" checked={roomsAndParkingEnabled} onChange={handleRoomsParkingToggle} />
                  <label className="form-check-label" htmlFor="enableRoomsParking">
                    Add Rooms & Parking Details
                  </label>
                </div>
                <small className="form-text text-muted d-block mb-3">Check this box if you want to specify the number of rooms and parking spaces. Keep it unchecked if not applicable (e.g., for a plot of land).</small>
                <div className="row">
                  <div className="col-md-3 mb-3"><input type="number" className="form-control" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" required={roomsAndParkingEnabled} disabled={!roomsAndParkingEnabled} /></div>
                  <div className="col-md-3 mb-3"><input type="number" className="form-control" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" required={roomsAndParkingEnabled} disabled={!roomsAndParkingEnabled} /></div>
                  <div className="col-md-3 mb-3"><input type="number" className="form-control" name="noOfBalcony" value={formData.noOfBalcony} onChange={handleChange} placeholder="Balconies" disabled={!roomsAndParkingEnabled} /></div>
                  <div className="col-md-3 mb-3"><input type="number" className="form-control" name="parkingNo" value={formData.parkingNo} onChange={handleChange} placeholder="Parking Spaces" disabled={!roomsAndParkingEnabled} /></div>
                </div>
              </div>

              {/* Area Details */}
              <div className="form-section">
                <h5>Area Details</h5>
                <div className="row align-items-end">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Build-up Area</label>
                    <div className="input-group">
                      <input type="number" className="form-control" name="buildUpArea" value={formData.buildUpArea} onChange={handleChange} placeholder="e.g., 1500" />
                      <select className="form-select" name="buildUpUnit" value={formData.buildUpUnit} onChange={handleChange} style={{ flex: "0 0 80px" }}>
                        <option value="Sq.ft">Sq.ft</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Land Area</label>
                    <div className="input-group">
                      <input type="number" className="form-control" name="landArea" value={formData.landArea} onChange={handleChange} placeholder="e.g., 5" />
                      <select className="form-select" name="landUnit" value={formData.landUnit} onChange={handleChange} style={{ flex: "0 0 80px" }}>
                        <option value="Cent">Cent</option>
                        <option value="Acre">Acre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-section">
                <h5>Location & Media</h5>
                <div className="row">
                  <div className="col-md-6 mb-3"><input type="text" className="form-control" name="location.city" value={formData.location.city} onChange={handleChange} placeholder="City" required /></div>
                  <div className="col-md-6 mb-3"><input type="text" className="form-control" name="location.district" value={formData.location.district} onChange={handleChange} placeholder="District / Area" required /></div>
                  <div className="col-md-6 mb-3"><input type="number" step="any" className="form-control" name="location.latitude" value={formData.location.latitude} onChange={handleChange} placeholder="Latitude" /></div>
                  <div className="col-md-6 mb-3"><input type="number" step="any" className="form-control" name="location.longitude" value={formData.location.longitude} onChange={handleChange} placeholder="Longitude" /></div>
                  <div className="col-12 mb-3"><input type="url" className="form-control" name="location.imageUrl" value={formData.location.imageUrl} onChange={handleChange} placeholder="Image URL" /></div>
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <h5>Description</h5>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe the property..."></textarea>
              </div>

              {/* Contact Details */}
              <div className="form-section">
                <h5>Your Contact Details</h5>
                <div className="row">
                  <div className="col-md-6 mb-3"><input type="tel" className="form-control" name="customerDetails.contactNumber" value={formData.customerDetails.contactNumber} onChange={handleChange} placeholder="Contact Number" required /></div>
                  <div className="col-md-6 mb-3"><input type="email" className="form-control" name="customerDetails.email" value={formData.customerDetails.email} onChange={handleChange} placeholder="Email" required /></div>
                  <div className="col-12 mb-3"><textarea className="form-control" name="customerDetails.extraNotes" value={formData.customerDetails.extraNotes} onChange={handleChange} rows="2" placeholder="Extra notes (optional)"></textarea></div>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Post Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPropertyModal;
