import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    api.get('/tickets/stats').then(res => setStats(res.data)).catch(console.error);
    api.get('/disputes').then(res => setDisputes(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Administrator Dashboard</h1>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <span className="stat-label">Total Unpaid Fines Count</span>
          <span className="stat-value">{stats.totalUnpaidFineCount || 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Most Common Violation</span>
          <span className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
            {stats.mostCommonViolationType || 'N/A'}
          </span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Fines Collected Per Type</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Violation Type</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {stats.finesCollectedPerType && stats.finesCollectedPerType.map((item, index) => (
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td>${item[1]}</td>
                </tr>
              ))}
              {(!stats.finesCollectedPerType || stats.finesCollectedPerType.length === 0) && (
                <tr><td colSpan="2">No collections yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>All Disputes Report</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Dispute ID</th>
                <th>Ticket ID</th>
                <th>Status</th>
                <th>Resolved By</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map(d => (
                <tr key={d.id}>
                  <td>#{d.id}</td>
                  <td>#{d.violationTicket.id}</td>
                  <td>
                    <span className={`badge badge-${d.disputeStatus === 'APPROVED' ? 'success' : d.disputeStatus === 'REJECTED' ? 'danger' : 'warning'}`}>
                      {d.disputeStatus}
                    </span>
                  </td>
                  <td>{d.resolvedBy?.name || '-'}</td>
                  <td>{d.resolutionRemark || '-'}</td>
                </tr>
              ))}
              {disputes.length === 0 && <tr><td colSpan="5">No disputes.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
