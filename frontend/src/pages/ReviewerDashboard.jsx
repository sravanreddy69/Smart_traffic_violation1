import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionRemark, setResolutionRemark] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await api.get('/disputes');
      setDisputes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (status) => {
    if (!selectedDispute || !resolutionRemark) return;
    try {
      await api.put(`/disputes/${selectedDispute.id}/resolve`, {
        resolvedById: user.id,
        resolutionRemark,
        disputeStatus: status
      });
      alert(`Dispute ${status} successfully!`);
      setSelectedDispute(null);
      setResolutionRemark('');
      fetchDisputes();
    } catch (err) {
      alert("Failed to resolve dispute: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Review Officer Dashboard</h1>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Open Disputes</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Dispute ID</th>
                <th>Ticket ID</th>
                <th>Raised By</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map(d => (
                <tr key={d.id}>
                  <td>#{d.id}</td>
                  <td>#{d.violationTicket.id}</td>
                  <td>{d.raisedBy.name}</td>
                  <td>{d.disputeReason}</td>
                  <td><span className={`badge badge-${d.disputeStatus === 'APPROVED' ? 'success' : d.disputeStatus === 'REJECTED' ? 'danger' : 'warning'}`}>{d.disputeStatus}</span></td>
                  <td>
                    {d.disputeStatus === 'OPEN' && (
                      <button className="btn btn-outline" onClick={() => setSelectedDispute(d)}>Review</button>
                    )}
                  </td>
                </tr>
              ))}
              {disputes.length === 0 && <tr><td colSpan="6">No disputes found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDispute && (
        <div className="card" style={{ border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Resolving Dispute #{selectedDispute.id}</h3>
          <p style={{ marginBottom: '1rem' }}><strong>Reason:</strong> {selectedDispute.disputeReason}</p>
          <div className="form-group">
            <label className="form-label">Resolution Remark</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={resolutionRemark} 
              onChange={(e) => setResolutionRemark(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-success" onClick={() => handleResolve('APPROVED')}>Approve</button>
            <button className="btn btn-danger" onClick={() => handleResolve('REJECTED')}>Reject</button>
            <button className="btn btn-outline" onClick={() => setSelectedDispute(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;
