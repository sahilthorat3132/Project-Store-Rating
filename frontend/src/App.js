import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StoreListPage from './pages/StoreListPage';
import OwnerDashboard from './pages/OwnerDashboard';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './utils/AuthContext';
import AddUserForm from './pages/AddUserForm';
import AddStoreForm from './pages/AddStoreForm';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminStoreListPage from './pages/AdminStoreListPage';
import PasswordUpdatePage from './pages/PasswordUpdatePage';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminUserListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminStoreListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <PrivateRoute roles={['user']}>
                <StoreListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-password"
            element={
              <PrivateRoute roles={['user', 'owner']}>
                <PasswordUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <PrivateRoute roles={['admin']}>
                <AddUserForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-store"
            element={
              <PrivateRoute roles={['admin']}>
                <AddStoreForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <PrivateRoute roles={['owner']}>
                <OwnerDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
