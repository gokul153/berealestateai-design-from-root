import React, { useState, useEffect, useCallback } from 'react';

// Date helpers
const getTodaysDate = () => new Date().toISOString().split('T')[0];
const getFirstDayOfMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay.toISOString().split('T')[0];
};

export default function LoyaltyPoints({ onLogout }) {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getTodaysDate());

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLoyalWinners = useCallback(async (currentPage, isNewFilter = false) => {
    setLoading(true);
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

      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/loyal-winners?${params.toString()}`,
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
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch loyalty winners." }));
        throw new Error(errorData.detail || "Failed to fetch loyalty winners.");
      }

      const data = await response.json();
      
      setWinners(prev => isNewFilter ? (data.items || []) : [...prev, ...(data.items || [])]);
      setHasMore(data.current_page < data.total_pages);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, onLogout]);

  useEffect(() => {
    fetchLoyalWinners(page, page === 1);
  }, [page, fetchLoyalWinners]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (page === 1) {
      fetchLoyalWinners(1, true);
    } else {
      setPage(1);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold m-0">Loyalty Winners</h2>
      <p className="text-muted mt-1">Users who have won a free order through the loyalty program.</p>

      {/* Filter Section */}
      <div className="card shadow-sm border-0 rounded-4 my-4 bg-light">
        <div className="card-body">
          <form onSubmit={handleFilterSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label small text-muted mb-1">From Date</label>
                <input type="date" className="form-control form-control-sm rounded-3" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div className="col-md-5">
                <label className="form-label small text-muted mb-1">To Date</label>
                <input type="date" className="form-control form-control-sm rounded-3" value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-dark btn-sm w-100 rounded-3" disabled={loading}>
                  {loading && page === 1 ? '...' : 'Filter'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 shadow-sm text-center small">{error}</div>
      )}

      {/* Winners List */}
      <div className="d-flex flex-column gap-3">
        {winners.map((winner) => (
          <div key={winner._id} className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title fw-bold mb-1 text-primary">{winner.userName}</h5>
                  <p className="card-text text-muted small mb-2">{winner.userId}</p>
                </div>
                <span className="badge bg-success rounded-pill p-2">
                  <i className="bi bi-trophy-fill me-1"></i> Won on {new Date(winner.winTimestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="card-text small bg-light p-2 rounded-3 mt-2 mb-0">
                <strong>Address:</strong> {winner.userAddress || 'Not provided'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading && page === 1 && (
        <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
      )}

      {!loading && hasMore && winners.length > 0 && (
        <button className="btn btn-outline-primary w-100 mt-4 py-2 rounded-pill shadow-sm fw-bold" onClick={() => setPage(prev => prev + 1)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Winners'}
        </button>
      )}

      {!loading && winners.length === 0 && !error && (
        <div className="text-center py-5 text-muted bg-light rounded-4 mt-3 border">
          <span role="img" aria-label="empty" style={{ fontSize: "2.5rem" }}>🏆</span>
          <p className="mt-2 mb-0 fw-bold">No loyalty winners found.</p>
          <p className="small">Try adjusting your date filters.</p>
        </div>
      )}
    </div>
  );
}