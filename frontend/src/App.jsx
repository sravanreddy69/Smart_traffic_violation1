import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import Login from './pages/Login';

// Placeholder imports for pages
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ReviewerDashboard from './pages/ReviewerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout allowedRoles={['CITIZEN']} />}>
            <Route path="/citizen/*" element={<CitizenDashboard />} />
          </Route>

          <Route element={<Layout allowedRoles={['TRAFFIC_OFFICER']} />}>
            <Route path="/officer/*" element={<OfficerDashboard />} />
          </Route>

          <Route element={<Layout allowedRoles={['REVIEW_OFFICER']} />}>
            <Route path="/reviewer/*" element={<ReviewerDashboard />} />
          </Route>

          <Route element={<Layout allowedRoles={['ADMIN']} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          <Route element={<Layout allowedRoles={['CITIZEN', 'TRAFFIC_OFFICER', 'REVIEW_OFFICER', 'ADMIN']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
