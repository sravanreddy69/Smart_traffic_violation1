import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        My Profile
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--text-muted)' }}>ID:</strong>
          <span>#{user.id}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--text-muted)' }}>Name:</strong>
          <span style={{ fontWeight: '600' }}>{user.name}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--text-muted)' }}>Email:</strong>
          <span>{user.email}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--text-muted)' }}>Phone Number:</strong>
          <span>{user.phoneNumber}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--text-muted)' }}>Role:</strong>
          <span className="badge badge-info">{user.role}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--text-muted)' }}>Account Created:</strong>
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
