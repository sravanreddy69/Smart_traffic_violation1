import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const user = users.find(u => u.id === Number(selectedUser));
    if (user) {
      login(user);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'TRAFFIC_OFFICER') navigate('/officer');
      else if (user.role === 'REVIEW_OFFICER') navigate('/reviewer');
      else navigate('/citizen');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>Smart Traffic System</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Select Mock User to Login</label>
            <select 
              className="form-control" 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">-- Select User --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <p className="form-error" style={{ color: 'var(--text-muted)' }}>* System bypasses password for demonstration</p>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
