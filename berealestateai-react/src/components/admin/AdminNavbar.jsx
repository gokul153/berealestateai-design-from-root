import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminNavbar({ onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">bekrishnafoods</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink 
                className="nav-link"
                to="/admin/orders"
              >
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link"
                to="/admin/audit-logs"
              >
                Audit Logs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link"
                to="/admin/loyalty-points"
              >
                Loyalty Points
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link"
                to="/admin/loyalty-status"
              >
                Loyalty Status
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link"
                to="/admin/customer-onboarding"
              >
                Customer Onboarding
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link"
                to="/admin/manual-order"
              >
                Manual Order
              </NavLink>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}