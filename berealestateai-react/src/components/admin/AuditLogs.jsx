import React, { useState, useEffect, useCallback } from 'react';

// Date helpers
const getTodaysDate = () => new Date().toISOString().split('T')[0];
const getYesterdaysDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

// Component to render log details as a pretty-printed JSON
const LogDetails = ({ log }) => {
  if (!log.details) return null;
  return (
    <pre className="bg-dark text-white p-2 rounded small mt-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      {JSON.stringify(log.details, null, 2)}
    </pre>
  );
};

// Component for a single log entry inside the collapsible area
const LogEntry = ({ log }) => {
  const getLogLevelClass = (level) => {
    switch (level?.toUpperCase()) {
      case 'ERROR': return 'text-danger fw-bold';
      case 'WARN': return 'text-warning fw-bold';
      case 'INFO': return 'text-info';
      default: return 'text-muted';
    }
  };

  return (
    <div className="d-flex gap-3 border-bottom pb-2 mb-2">
      <div className="small text-muted" style={{ minWidth: '150px' }}>
        {new Date(log.timestamp).toLocaleString()}
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between">
          <span className={getLogLevelClass(log.level)}>{log.level}</span>
          <span className="badge bg-secondary">{log.node}</span>
        </div>
        <p className="mb-0 mt-1 small">{log.message}</p>
        <LogDetails log={log} />
      </div>
    </div>
  );
};

export default function AuditLogs({ onLogout }) {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Filter States
  const [fromDate, setFromDate] = useState(getYesterdaysDate());
  const [toDate, setToDate] = useState(getTodaysDate());
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAuditLogs = useCallback(async (currentPage, isNewFilter = false) => {
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
      if (customerId) params.append("customer_id", customerId);
      if (status) params.append("status", status);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/audit-logs?${params.toString()}`,
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
        throw new Error("Failed to fetch audit logs.");
      }

      const data = await response.json();
      
      const itemsWithId = (data.items || []).map((item, index) => ({
        ...item,
        // The backend should ideally provide a unique ID. Using created_at as a fallback.
        _id: item._id || `${item.created_at}-${index}` 
      }));

      setAuditLogs(prev => isNewFilter ? itemsWithId : [...prev, ...itemsWithId]);
      setHasMore(data.current_page < data.total_pages);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, customerId, status, onLogout]);

  useEffect(() => {
    fetchAuditLogs(page, page === 1);
  }, [page, fetchAuditLogs]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setExpandedIds(new Set()); // Collapse all on new filter
    if (page === 1) {
      fetchAuditLogs(1, true);
    } else {
      setPage(1);
    }
  };

  const toggleExpansion = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS': return 'bg-success';
      case 'FAILED': return 'bg-danger';
      case 'ERROR': return 'bg-danger'; // Also handle ERROR for robustness
      case 'IN_PROGRESS': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold m-0">Audit Logs</h2>

      {/* Filter Section */}
      <div className="card shadow-sm border-0 rounded-4 my-4 bg-light">
        <div className="card-body">
          <form onSubmit={handleFilterSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">From Date</label>
                <input type="date" className="form-control form-control-sm rounded-3" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">To Date</label>
                <input type="date" className="form-control form-control-sm rounded-3" value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">Customer ID</label>
                <input type="text" className="form-control form-control-sm rounded-3" placeholder="e.g. 91..." value={customerId} onChange={e => setCustomerId(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">Status</label>
                <select className="form-select form-select-sm rounded-3" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
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
        <div className="alert alert-danger rounded-3 shadow-sm text-center small">{error}</div>
      )}

      {/* Logs List */}
      <div className="d-flex flex-column gap-3">
        {auditLogs.map((log) => (
          <div key={log._id} className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center" onClick={() => toggleExpansion(log._id)} style={{ cursor: 'pointer' }}>
              <div>
                <span className="fw-bold text-primary">{log.customer_id}</span>
                <span className="text-muted small mx-2">|</span>
                <span className="text-muted small">{new Date(log.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className={`badge ${getStatusBadge(log.status)} me-2`}>{log.status}</span>
                <button className="btn btn-sm btn-outline-secondary py-0 px-2">
                  <i className={`bi ${expandedIds.has(log._id) ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
              </div>
            </div>
            <div className={`collapse ${expandedIds.has(log._id) ? 'show' : ''}`}>
              <div className="card-body">
                {log.error_message && (
                  <div className="alert alert-danger small p-2">
                    <strong>Error:</strong> {log.error_message}
                  </div>
                )}
                <div className="p-2 bg-light rounded-3">
                  {log.logs?.length > 0 ? (
                    log.logs.map((entry, index) => <LogEntry key={index} log={entry} />)
                  ) : (
                    <p className="text-muted small mb-0">No detailed logs available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && page === 1 && (
        <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
      )}

      {!loading && hasMore && auditLogs.length > 0 && (
        <button className="btn btn-outline-primary w-100 mt-4 py-2 rounded-pill shadow-sm fw-bold" onClick={() => setPage(prev => prev + 1)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Logs'}
        </button>
      )}

      {!loading && auditLogs.length === 0 && !error && (
        <div className="text-center py-5 text-muted bg-light rounded-4 mt-3 border">
          <span role="img" aria-label="empty" style={{ fontSize: "2.5rem" }}>📭</span>
          <p className="mt-2 mb-0 fw-bold">No audit logs found.</p>
          <p className="small">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}