import React, { useState, useEffect, useCallback } from "react";

// Helper to get default dates
const getTodaysDate = () => new Date().toISOString().split('T')[0];
const getYesterdaysDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export default function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [fromDate, setFromDate] = useState(getYesterdaysDate());
  const [toDate, setToDate] = useState(getTodaysDate());
  const [userId, setUserId] = useState("");
  const [routeId, setRouteId] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // State for individual order status updates
  const [updatingStatus, setUpdatingStatus] = useState({});

  // Use useCallback so we don't recreate this function on every render
  const fetchOrders = useCallback(async (currentPage, isNewFilter = false) => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // Dynamically build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        size: 10,
      });

      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      if (userId) params.append("user_id", userId);
      if (routeId) params.append("route_id", routeId);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/orders?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          // No need to throw an error, as we are navigating away.
          return;
        }
        if (response.status === 403) throw new Error("Unauthorized to view this page.");
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();

      // If applying a new filter, replace the list. Otherwise, append for pagination.
      setOrders(prev => isNewFilter ? (data.items || []) : [...prev, ...(data.items || [])]);
      
      // Check if we can load more pages based on your JSON response
      setHasMore(data.current_page < data.total_pages);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, userId, routeId, onLogout]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    setError(""); // Clear previous general errors

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Failed to update status to ${newStatus}` }));
        throw new Error(errorData.detail || `Failed to update status to ${newStatus}`);
      }

      const updatedOrder = await response.json();

      // Update the order in the local state
      setOrders(prevOrders => prevOrders.map(order => order.order_id === orderId ? { ...order, status: updatedOrder.status } : order));
    } catch (err) {
      setError(err.message); // Show error at the top of the page
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Initial load and pagination trigger
  useEffect(() => {
    fetchOrders(page, page === 1);
  }, [page, fetchOrders]);

  // Handle form submission for filters
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (page === 1) {
      // If already on page 1, manually trigger fetch since page state won't change
      fetchOrders(1, true);
    } else {
      // This will trigger the useEffect
      setPage(1); 
    }
  };

  // Helper function to format strings like "appam_mavu" to "Appam Mavu"
  const formatItemName = (name) => {
    if (!name) return "";
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'pending':
      case 'draft':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}> 
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0 fs-4">bekrishnafoods portal</h2>
        <span className="badge bg-primary rounded-pill">Admin</span>
      </div>

      {/* --- Filter Section --- */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 bg-light">
        <div className="card-body">
          <form onSubmit={handleFilterSubmit}>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small text-muted mb-1">From Date</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm rounded-3" 
                  value={fromDate} 
                  onChange={e => setFromDate(e.target.value)} 
                />
              </div>
              <div className="col-6">
                <label className="form-label small text-muted mb-1">To Date</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm rounded-3" 
                  value={toDate} 
                  onChange={e => setToDate(e.target.value)} 
                />
              </div>
              <div className="col-12 mt-2">
                <label className="form-label small text-muted mb-1">Customer WhatsApp ID</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm rounded-3" 
                  placeholder="e.g. TES_PHONE..." 
                  value={userId} 
                  onChange={e => setUserId(e.target.value)} 
                />
              </div>
              <div className="col-12 mt-2">
                <label className="form-label small text-muted mb-1">Route</label>
                <select className="form-select form-select-sm rounded-3" value={routeId} onChange={e => setRouteId(e.target.value)}>
                  <option value="">All Routes</option>
                  <option value="1">Route 1 :- Kazhakuttam Route</option>
                  <option value="2">Route 2 :- Nallanjara Route</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-dark btn-sm w-100 mt-3 rounded-pill" disabled={loading}>
              {loading && page === 1 ? 'Applying Filters...' : 'Apply Filters'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 shadow-sm text-center small">
          {error}
        </div>
      )}

      {/* --- Orders List --- */}
      <div className="d-flex flex-column gap-3">
        {orders.map((order) => {
          const isUpdating = updatingStatus[order.order_id];
          return (
          <div key={order.order_id} className="card shadow-sm border-0 rounded-4 overflow-hidden">
            
            {/* Header: Order ID & Status */}
            <div className="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-end align-items-center">
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                {order.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            
            <div className="card-body pt-2 pb-2">
              {/* Customer Info */}
              <h5 className="card-title fw-bold mb-1 text-truncate text-primary">
                <i className="bi bi-shop me-2"></i>
                {order.customer_shop_name || order.user_name || 'Unknown Shop'}
              </h5>
              <p className="card-text text-muted small mb-2">
                <i className="bi bi-person-fill me-2"></i>{order.user_name} ({order.user_id})
              </p>
              {order.user_address && (
                <p className="card-text small bg-light p-2 rounded-3 mb-3">
                  <i className="bi bi-geo-alt-fill me-2"></i>{order.user_address}
                </p>
              )}
              
              {/* Items List */}
              <div className="bg-light rounded-3 p-2 mb-3">
                <h6 className="small fw-bold text-muted mb-2">Order Items:</h6>
                {order.items && order.items.length > 0 ? (
                  <ul className="list-unstyled mb-0 gap-1 d-flex flex-column">
                    {order.items.map((item, i) => (
                      <li key={i} className="d-flex justify-content-between small border-bottom border-white pb-1">
                        <span>{formatItemName(item.name)}</span>
                        <span className="fw-bold">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="small text-muted">No items recorded.</span>
                )}
              </div>

              {/* Badges for Route, Free Order & Date */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="text-muted small">
                  {new Date(order.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <div>
                  {order.route_id && <span className="badge bg-dark me-1">Route {order.route_id}</span>}
                  {order.is_free_order && (
                    <span className="badge bg-info text-dark rounded-pill">Free Order</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="card-footer bg-white border-top-0 pt-0 pb-3 d-flex justify-content-end gap-2">
              <button
                className="btn btn-sm btn-outline-success d-flex align-items-center"
                onClick={() => handleUpdateStatus(order.order_id, 'confirmed')}
                disabled={isUpdating || order.status === 'confirmed' || order.status === 'cancelled'}
              >
                {isUpdating ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-check-circle-fill me-1"></i>
                )}
                Confirm
              </button>
              <button
                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                onClick={() => handleUpdateStatus(order.order_id, 'cancelled')}
                disabled={isUpdating || order.status === 'cancelled'}
              >
                {isUpdating ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-x-circle-fill me-1"></i>
                )}
                Cancel
              </button>
            </div>
          </div>
          )
        })}
      </div>

      {/* Loading Spinner */}
      {loading && page === 1 && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && orders.length > 0 && (
        <button 
          className="btn btn-outline-primary w-100 mt-4 py-2 rounded-pill shadow-sm fw-bold"
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More Orders'}
        </button>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-5 text-muted bg-light rounded-4 mt-3 border">
          <span role="img" aria-label="empty" style={{ fontSize: "2.5rem" }}>📭</span>
          <p className="mt-2 mb-0 fw-bold">No orders found.</p>
          <p className="small">Try adjusting your date filters.</p>
        </div>
      )}
    </div>
  );
}