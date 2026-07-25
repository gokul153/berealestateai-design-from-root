import React, { useState } from 'react';

export default function CustomerOnboarding({ onLogout }) {
  const initialFormState = {
    country_code: "91",
    phone_number: "",
    name: "",
    customer_shop_name: "",
    address: "",
    latitude: "",
    longitude: "",
    route_id: "1",
    eligible_for_loyalty: true,
    reminder_type: "daily",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: e.target.type === 'checkbox' ? e.target.checked : value 
    }));
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    setError("");
    setSuccess("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationLoading(false);
        setSuccess("Location captured successfully!");
      },
      () => {
        setError("Unable to retrieve location. Please enable location services. A wrong location will be updated if you proceed.");
        setFormData(prev => ({
          ...prev,
          latitude: 0,
          longitude: 0,
        }));
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Customer Name is required.");
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(formData.phone_number.trim())) {
      setError("WhatsApp number must be 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const { country_code, phone_number, ...restOfData } = formData;

      const payload = {
        ...restOfData,
        whatsapp_id: `${country_code}${phone_number}`,
        customer_shop_name: formData.customer_shop_name || formData.name,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/customers/onboard`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          return;
        }
        const errorData = await response.json().catch(() => ({ detail: "Onboarding failed with an unknown error." }));
        
        let errorMessage = errorData.detail;
        if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.map(err => `${err.loc.join(' > ')}: ${err.msg}`).join(', ');
        }
        
        throw new Error(errorMessage || "Onboarding failed.");
      }

      setSuccess("Customer onboarded successfully!");
      setFormData(initialFormState); // Reset form on success

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "700px" }}>
      <h2 className="fw-bold m-0">Customer Onboarding</h2>
      <p className="text-muted mt-1">Add a new customer to the WhatsApp chatbot system.</p>

      <div className="card shadow-sm border-0 rounded-4 mt-4">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Customer Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., John Doe" required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">WhatsApp Number</label>
                <div className="input-group">
                  <select className="form-select" name="country_code" value={formData.country_code} onChange={handleChange} style={{ maxWidth: '85px' }}>
                    <option value="91">+91</option>
                  </select>
                  <input type="tel" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="9876543210" required pattern="\d{10}" title="Please enter a 10-digit phone number." />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Shop Name</label>
                <input type="text" className="form-control" name="customer_shop_name" value={formData.customer_shop_name} onChange={handleChange} placeholder="Defaults to customer name if empty" />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Address</label>
                <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Full delivery address" required></textarea>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">Route</label>
                <select className="form-select" name="route_id" value={formData.route_id} onChange={handleChange} required>
                  <option value="1">Route 1 :- Kazhakuttam Route</option>
                  <option value="2">Route 2 :- Nallanjara Route</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Reminder Type</label>
                <select className="form-select" name="reminder_type" value={formData.reminder_type} onChange={handleChange} required>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="random">Random</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Location</label>
                <div className="input-group">
                  <button className="btn btn-outline-secondary" type="button" onClick={handleGetLocation} disabled={locationLoading}>
                    {locationLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-geo-alt-fill"></i>
                    )}
                    <span className="ms-2">Get Current Location</span>
                  </button>
                  <input type="number" step="any" className="form-control" placeholder="Latitude" value={formData.latitude} onChange={handleChange} name="latitude" required />
                  <input type="number" step="any" className="form-control" placeholder="Longitude" value={formData.longitude} onChange={handleChange} name="longitude" required />
                </div>
              </div>

              <div className="col-12">
                <div className="form-check form-switch mt-2">
                  <input className="form-check-input" type="checkbox" role="switch" id="eligibleForLoyalty" name="eligible_for_loyalty" checked={formData.eligible_for_loyalty} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="eligibleForLoyalty">Eligible for Loyalty Program</label>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}
            {success && <div className="alert alert-success mt-4 mb-0">{success}</div>}

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={loading}>
                {loading ? "Onboarding..." : "Onboard Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}