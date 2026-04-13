import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const CitizenDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<CitizenHome />} />
      <Route path="/vehicle" element={<RegisterVehicle />} />
    </Routes>
  );
};

const CitizenHome = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);

  const [disputeReason, setDisputeReason] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vRes = await api.get('/vehicles');
      setVehicles(vRes.data.filter(v => v.owner.id === user.id));

      const tRes = await api.get('/tickets');
      setTickets(tRes.data.filter(t => t.vehicle.owner.id === user.id));

      const pRes = await api.get('/payments');
      // Hacky array filter
      setPayments(pRes.data.filter(p => p.violationTicket.vehicle.owner.id === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePay = async (ticket) => {
    try {
      await api.post('/payments', { ticketId: ticket.id, amount: ticket.fineAmount });
      alert("Payment successful!");
      fetchData();
    } catch (err) {
      alert("Payment failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDispute = async (e) => {
    e.preventDefault();
    if (!selectedTicketId || !disputeReason) return;
    try {
      await api.post('/disputes', { ticketId: selectedTicketId, raisedById: user.id, disputeReason });
      alert("Dispute raised!");
      setSelectedTicketId(null);
      setDisputeReason('');
      fetchData();
    } catch(err) {
      alert("Failed to raise dispute: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Welcome, {user.name}</h1>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <span className="stat-label">My Vehicles</span>
          <span className="stat-value">{vehicles.length}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Unpaid Tickets</span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>
            {tickets.filter(t => ['ISSUED', 'PENDING_PAYMENT', 'OVERDUE'].includes(t.ticketStatus)).length}
          </span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>My Violation Tickets</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Vehicle</th>
                <th>Violation</th>
                <th>Fine</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.vehicle.vehicleNumber}</td>
                  <td>{t.violationType.violationName}</td>
                  <td>${t.fineAmount}</td>
                  <td>{t.dueDate}</td>
                  <td><span className={`badge badge-${t.ticketStatus === 'PAID' ? 'success' : t.ticketStatus === 'OVERDUE' ? 'danger' : 'warning'}`}>{t.ticketStatus}</span></td>
                  <td>
                    {['ISSUED', 'PENDING_PAYMENT', 'OVERDUE'].includes(t.ticketStatus) && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-success" onClick={() => handlePay(t)}>Pay</button>
                        <button className="btn btn-outline" onClick={() => setSelectedTicketId(t.id)}>Dispute</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && <tr><td colSpan="7">No tickets found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicketId && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--danger)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Raise Dispute for Ticket #{selectedTicketId}</h3>
          <form onSubmit={handleDispute}>
            <div className="form-group">
              <label className="form-label">Reason for Dispute</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={disputeReason} 
                onChange={(e) => setDisputeReason(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-danger">Submit Dispute</button>
              <button type="button" className="btn btn-outline" onClick={() => setSelectedTicketId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Payment History</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Ticket ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.referenceId.substring(0,8)}</td>
                  <td>#{p.violationTicket.id}</td>
                  <td>${p.amount}</td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td><span className={`badge badge-success`}>{p.paymentStatus}</span></td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan="5">No payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RegisterVehicle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', { vehicleNumber, vehicleType, ownerId: user.id });
      alert("Vehicle registered successfully");
      navigate('/citizen');
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Register New Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Vehicle Number / License Plate</label>
          <input className="form-control" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Vehicle Type</label>
          <select className="form-control" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
            <option value="Bus">Bus</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Vehicle</button>
      </form>
    </div>
  );
};

export default CitizenDashboard;
