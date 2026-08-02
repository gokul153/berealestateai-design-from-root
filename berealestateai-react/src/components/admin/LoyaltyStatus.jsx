import React, { useState, useEffect, useCallback } from 'react';

export default function LoyaltyStatus({ onLogout }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLoyaltyStatuses = useCallback(async (currentPage) => {
    // For the first page load, we don't want to append, but replace.
    const isFirstPage = currentPage === 1;
    if (isFirstPage) {
      setLoading(true);
    }
    setError("");

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const params = new URLSearchParams({
        page: currentPage,
        size: 20,
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/loyalty-status?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) onLogout();
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch loyalty statuses." }));
        throw new Error(errorData.detail || "Failed to fetch loyalty statuses.");
      }

      const data = await response.json();
      
      setStatuses(prev => isFirstPage ? (data.items || []) : [...prev, ...(data.items || [])]);
      setHasMore(data.current_page < data.total_pages);

    } catch (err) {
      setError(err.message);
    } finally {
      if (isFirstPage) {
        setLoading(false);
      }
    }
  }, [onLogout]);

  useEffect(() => {
    fetchLoyaltyStatuses(page);
  }, [page, fetchLoyaltyStatuses]);

  const renderProgressBar = (count, threshold) => {
    const percentage = (count / threshold) * 100;
    return (
      <div className="progress" style={{ height: '20px' }}>
        <div 
          className="progress-bar bg-success" 
          role="progressbar" 
          style={{ width: `${percentage}%` }} 
          aria-valuenow={count} 
          aria-valuemin="0" 
          aria-valuemax={threshold}
        >
          {count} / {threshold}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold m-0">Customer Loyalty Status</h2>
      <p className="text-muted mt-1">Track customer progress towards loyalty rewards.</p>

      {error && <div className="alert alert-danger rounded-3 shadow-sm text-center small mt-4">{error}</div>}

      <div className="list-group mt-4">
        {statuses.map((status) => {
          const ordersToGo = status.threshold - status.order_count;
          const isNearThreshold = ordersToGo > 0 && ordersToGo < 5;

          let isNearExpiry = false;
          if (status.created_at) {
            const createdAtDate = new Date(status.created_at);
            const now = new Date();
            const diffTime = now.getTime() - createdAtDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            isNearExpiry = diffDays >= 6 && ordersToGo > 0;
          }

          let itemClass = '';
          if (isNearExpiry) {
            itemClass = 'list-group-item-danger';
          } else if (isNearThreshold) {
            itemClass = 'list-group-item-warning';
          }

          return (
            <div key={status.user_id} className={`list-group-item list-group-item-action d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 ${itemClass}`}>
              <div className="flex-grow-1">
                <h5 className="mb-1 fw-bold">{status.customer_shop_name || status.user_name}</h5>
                <p className="mb-1 text-muted small">{status.user_name} ({status.user_id})</p>
                {renderProgressBar(status.order_count, status.threshold)}
                <div className="d-flex justify-content-between text-muted small mt-2" style={{ fontSize: '0.8rem' }}>
                  <span>Started: {status.created_at ? new Date(status.created_at).toLocaleDateString() : 'N/A'}</span>
                  <span>Last Update: {status.updated_at ? new Date(status.updated_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="text-md-end">
                <p className="fw-bold mb-0">{ordersToGo > 0 ? `${ordersToGo} to go` : 'Reward Ready!'}</p>
                <small className="text-muted">for a free order</small>
              </div>
            </div>
          );
        })}
      </div>

      {loading && page === 1 && <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}
      {!loading && hasMore && statuses.length > 0 && <button className="btn btn-outline-primary w-100 mt-4 py-2 rounded-pill shadow-sm fw-bold" onClick={() => setPage(prev => prev + 1)} disabled={loading}>Load More</button>}
      {!loading && statuses.length === 0 && !error && <div className="text-center py-5 text-muted bg-light rounded-4 mt-3 border"><span role="img" aria-label="empty" style={{ fontSize: "2.5rem" }}>📊</span><p className="mt-2 mb-0 fw-bold">No loyalty status found.</p><p className="small">Customer data will appear here as they place orders.</p></div>}
    </div>
  );
}