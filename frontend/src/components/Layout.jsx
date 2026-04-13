import React from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, FileText, CreditCard, AlertCircle, BarChart2 } from 'lucide-react';

export const Layout = ({ allowedRoles }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 className="navbar-brand">Traffic System</h2>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Role: {user.role}</p>
          <p style={{ fontSize: '0.75rem', fontWeight: "bold" }}>User: {user.name}</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {user.role === 'CITIZEN' && (
            <>
              <Link to="/citizen" className="sidebar-link"><Home size={18}/> Dashboard</Link>
              <Link to="/citizen/vehicle" className="sidebar-link"><FileText size={18}/> Register Vehicle</Link>
            </>
          )}
          {user.role === 'TRAFFIC_OFFICER' && (
            <>
              <Link to="/officer" className="sidebar-link"><Home size={18}/> Dashboard</Link>
              <Link to="/officer/issue" className="sidebar-link"><AlertCircle size={18}/> Issue Ticket</Link>
            </>
          )}
          {user.role === 'REVIEW_OFFICER' && (
            <Link to="/reviewer" className="sidebar-link"><AlertCircle size={18}/> Review Disputes</Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="sidebar-link"><BarChart2 size={18}/> Analytics</Link>
          )}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <Link to="/profile" className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem', display: 'flex' }}>
            <Home size={16}/> My Profile
          </Link>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
