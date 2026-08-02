import React, { useState, useEffect, useCallback } from 'react';

//todo take it from api in future
const AVAILABLE_ITEMS = [
  { value: 'appam_mavu', label: 'Appam Mavu' },
  { value: 'dosa_mavu', label: 'Dosa Mavu' },
  { value: 'puttu_podi', label: 'Puttu Podi' },
];

export default function ManualOrder({ onLogout }) {
  // Customer state
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Form state
  const [items, setItems] = useState([{ name: '', quantity: 1 }]);
  const [calculateLoyalty, setCalculateLoyalty] = useState(true);
  
  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    setError('');
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/customers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) onLogout();
        throw new Error("Failed to fetch customers.");
      }

      const data = await response.json();
      setCustomers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCustomers(false);
    }
  }, [onLogout]);

  // Fetch customers for the dropdown on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.whatsapp_id === customerId) || null;
    setSelectedCustomer(customer);
    // Reset form when customer changes
    setItems([{ name: '', quantity: 1 }]);
    setSuccess('');
    setError('');
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError("Please select a customer.");
      return;
    }

    const validItems = items
      .filter(item => item.name && Number(item.quantity) > 0)
      .map(item => ({
        name: item.name,
        quantity: Number(item.quantity)
      }));

    if (validItems.length === 0) {
      setError("Please add at least one item with a quantity greater than 0.");
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication token not found.");

      const payload = {
        userId: selectedCustomer.whatsapp_id,
        items: validItems,
        calculateLoyalty: calculateLoyalty,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/orders/create-for-customer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) onLogout();
        const errorData = await response.json().catch(() => ({ detail: "Failed to create order." }));
        throw new Error(errorData.detail || "Failed to create order.");
      }

      const result = await response.json();
      setSuccess(`Order #${result.orderId.substring(0, 8)} created successfully for ${selectedCustomer.name}.`);
      // Reset form
      setSelectedCustomer(null);
      setItems([{ name: '', quantity: 1 }]);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "700px" }}>
      <h2 className="fw-bold m-0">Manual Order</h2>
      <p className="text-muted mt-1">Place a new order for a customer.</p>

      <div className="card shadow-sm border-0 rounded-4 mt-4">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} noValidate>
            {/* Customer Selection */}
            <div className="mb-4">
              <label htmlFor="customer-select" className="form-label fw-bold">Select Customer</label>
              <select 
                id="customer-select" 
                className="form-select" 
                value={selectedCustomer?.whatsapp_id || ''} 
                onChange={handleCustomerChange}
                disabled={loadingCustomers}
              >
                <option value="" disabled>{loadingCustomers ? 'Loading customers...' : 'Select a shop'}</option>
                {customers.map(customer => (
                  <option key={customer.whatsapp_id} value={customer.whatsapp_id}>
                    {customer.customer_shop_name} ({customer.name})
                  </option>
                ))}
              </select>
            </div>

            {selectedCustomer && (
              <>
                <div className="alert alert-info small">
                  <p className="mb-1"><strong>Selected Customer:</strong> {selectedCustomer.name}</p>
                  <p className="mb-0"><strong>WhatsApp ID:</strong> {selectedCustomer.whatsapp_id}</p>
                </div>

                {/* Items Section */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Order Items</label>
                  {items.map((item, index) => (
                    <div key={index} className="input-group mb-2">
                      <select 
                        className="form-select" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      >
                        <option value="" disabled>Select item</option>
                        {AVAILABLE_ITEMS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Qty" 
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                        style={{ maxWidth: '80px' }}
                      />
                      {items.length > 1 && (
                        <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveItem(index)}>
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleAddItem}>
                    <i className="bi bi-plus-circle me-1"></i> Add Item
                  </button>
                </div>

                {/* Loyalty Toggle */}
                <div className="form-check form-switch mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    id="calculateLoyalty" 
                    checked={calculateLoyalty} 
                    onChange={(e) => setCalculateLoyalty(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="calculateLoyalty">Calculate for Loyalty Program</label>
                </div>

                {error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}
                {success && <div className="alert alert-success mt-4 mb-0">{success}</div>}

                {/* Submit Button */}
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={submitting}>
                    {submitting ? "Placing Order..." : "Place Manual Order"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}