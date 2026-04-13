import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const OfficerDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<OfficerHome />} />
      <Route path="/issue" element={<IssueTicket />} />
    </Routes>
  );
};

const OfficerHome = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get('/tickets').then(res => setTickets(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Traffic Officer Dashboard</h1>
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>All Issued Tickets</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Violation</th>
                <th>Location</th>
                <th>Fine</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.vehicle.vehicleNumber}</td>
                  <td>{t.violationType.violationName}</td>
                  <td>{t.violationLocation}</td>
                  <td>${t.fineAmount}</td>
                  <td><span className={`badge badge-neutral`}>{t.ticketStatus}</span></td>
                </tr>
              ))}
              {tickets.length === 0 && <tr><td colSpan="6">No tickets issued yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const IssueTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [types, setTypes] = useState([]);
  
  const [vehicleId, setVehicleId] = useState('');
  const [violationTypeId, setViolationTypeId] = useState('');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    api.get('/vehicles').then(res => setVehicles(res.data)).catch(console.error);
    api.get('/violations').then(res => setTypes(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', {
        vehicleId: Number(vehicleId),
        violationTypeId: Number(violationTypeId),
        issuedById: user.id,
        violationLocation: location,
        dueDate: dueDate
      });
      alert("Ticket issued successfully");
      navigate('/officer');
    } catch (err) {
      alert("Error issuing ticket: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Issue Violation Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Vehicle</label>
          <select className="form-control" value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
            <option value="">-- Select --</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.owner.name})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Violation Type</label>
          <select className="form-control" value={violationTypeId} onChange={e => setViolationTypeId(e.target.value)} required>
            <option value="">-- Select --</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.violationName} - ${t.baseFineAmount}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-control" value={location} onChange={e => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Issue Ticket</button>
      </form>
    </div>
  );
};

export default OfficerDashboard;
