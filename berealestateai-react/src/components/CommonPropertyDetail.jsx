import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [contactDetails, setContactDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = !!sessionStorage.getItem("accessToken");
//todo need to reove this addictional call in future only call one api to get all details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/properties?property_id=${id}`;
        console.log(`Fetching property details from: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log("Response status:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          if (data.length > 1) {
            throw new Error("Multiple records found for this property ID.");
          }
          setProperty(data.length > 0 ? data[0] : null);
        } else {
          setProperty(data);
        }
      } catch (e) {
        console.error("Fetch failed:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const handleViewContact = async () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { message: "Please login to view contact details" } });
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/properties/customer-details?property_id=${id}`;

      const response = await fetch(apiUrl, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContactDetails(data);
      }
    } catch (e) {
      console.error("Failed to fetch contact details:", e);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    const isMultipleRecordsError = error.includes("Multiple records");
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          Error loading property: {error}
        </div>
        {isMultipleRecordsError && (
          <a
          ///todo fix email address
            href={`mailto:support@berealestate.ai?subject=Report: Multiple Records for Property ${id}&body=I encountered an error stating multiple records exist for property ID: ${id}.`}
            className="btn btn-danger me-2"
          >
            Report Issue
          </a>
        )}
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 text-center">
        <h3>Property not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const {
    title,
    category,
    propertyFor,
    price,
    property_age,
    waterSource,
    furnishing,
    bedrooms,
    bathrooms,
    noOfBalcony,
    parkingNo,
    buildUpArea,
    buildUpUnit,
    landArea,
    landUnit,
    description,
    location,
  } = property;

  const detailsList = [
    { label: "Property Age", value: property_age, unit: "Years" },
    { label: "Furnishing", value: furnishing },
    { label: "Water Source", value: waterSource },
    { label: "Balconies", value: noOfBalcony },
    { label: "Parking Spaces", value: parkingNo },
    { label: "Land Area", value: landArea, unit: landUnit },
  ];

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb / Back Button */}
      <button
        className="btn btn-link text-decoration-none ps-0 mb-3 text-secondary"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Listings
      </button>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">
          {/* Image Section */}
          <div className="card shadow-sm border-0 overflow-hidden mb-4">
            <img
              src={
                location?.imageUrl ||
                "https://via.placeholder.com/800x500?text=No+Image+Available"
              }
              alt={title}
              className="img-fluid w-100"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>

          {/* Title and Key Info */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h1 className="fw-bold mb-2">{title}</h1>
                <p className="text-muted fs-5 mb-2 d-flex align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="bi bi-geo-alt-fill me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  {location?.district}, {location?.city}
                </p>
              </div>
              <div className="text-end mt-2 mt-md-0">
                <h2 className="text-primary fw-bold mb-0">
                  ₹{price?.toLocaleString()}
                </h2>
                <span className="badge bg-success fs-6 mt-1">{propertyFor}</span>
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="card border-0 shadow-sm mb-4 bg-light">
            <div className="card-body">
              <div className="row text-center g-3">
                <div className="col-6 col-md-3 border-end">
                  <div className="fw-bold fs-4">{bedrooms}</div>
                  <div className="text-muted small">Bedrooms</div>
                </div>
                <div className="col-6 col-md-3 border-end-md">
                  <div className="fw-bold fs-4">{bathrooms}</div>
                  <div className="text-muted small">Bathrooms</div>
                </div>
                <div className="col-6 col-md-3 border-end">
                  <div className="fw-bold fs-4">{buildUpArea}</div>
                  <div className="text-muted small">{buildUpUnit}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="fw-bold fs-4">{category}</div>
                  <div className="text-muted small">Type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="fw-bold mb-3">Description</h4>
            <p className="text-muted" style={{ lineHeight: "1.8" }}>
              {description}
            </p>
          </div>

          {/* Detailed Specs */}
          <div className="mb-4">
            <h4 className="fw-bold mb-3">Property Details</h4>
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <table className="table table-striped mb-0">
                  <tbody>                    {detailsList.map(({ label, value, unit }) =>
                      (value || value === 0) ? (
                        <tr key={label}>
                          <td
                            className="text-muted ps-4 py-3"
                            style={{ width: "40%" }}
                          >
                            {label}
                          </td>
                          <td className="fw-medium py-3">
                            {value} {unit || ""}
                          </td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4">
          {/* Contact Card */}
          <div
            className="card shadow-sm border-0 mb-4 sticky-top"
            style={{ top: "20px", zIndex: 10 }}
          >
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Contact Information</h4>

              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                >
                  <span className="fs-4">A</span>
                </div>
                <div className="ms-3">
                  <h6 className="mb-0 fw-bold">Property Seller</h6>
                  <small className="text-muted">Contact Partner</small>
                </div>
              </div>

              {contactDetails ? (
                <>
                  <div className="d-flex flex-column gap-3">
                    <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                          Mobile Number
                        </small>
                        <span className="fw-bold text-dark">{contactDetails?.contactNumber}</span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-secondary bg-white"
                        onClick={() => handleCopy(contactDetails?.contactNumber)}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                          Email Address
                        </small>
                        <span className="fw-bold text-dark text-break">{contactDetails?.email}</span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-secondary bg-white"
                        onClick={() => handleCopy(contactDetails?.email)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {contactDetails?.extraNotes && (
                    <div className="mt-4 p-3 bg-light rounded border">
                      <small className="text-muted fw-bold d-block mb-1">
                        Agent Notes:
                      </small>
                      <small className="text-secondary">
                        {contactDetails.extraNotes}
                      </small>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleViewContact}
                  >
                    View Contact Details
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div
                className="bg-light d-flex align-items-center justify-content-center text-muted"
                style={{ height: "300px" }}
              >
                <div className="text-center">
                  <p className="mb-1">Map View</p>
                  <small>
                    Lat: {location?.latitude}, Long: {location?.longitude}
                  </small>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white py-3">
              <small className="text-muted">
                <strong>Location:</strong> {location?.district}, {location?.city}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
