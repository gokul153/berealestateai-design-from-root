import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({ onLogout }) {
  return (
    <div>
      <AdminNavbar onLogout={onLogout} />
      <main className="mt-3">
        <Outlet />
      </main>
    </div>
  );
}