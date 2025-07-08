import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Navbar.css'; //  Import the CSS file
import Logo from "./user-icon.png";
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h3>Store Rating</h3>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            {user?.role === 'admin' && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/users">User List</Link>
                <Link to="/admin/stores">Store List</Link>
                <Link to="/admin/add-user">Add User</Link>
                <Link to="/admin/add-store">Add Store</Link>
              </>
            )}
            {user.role === 'user' && (
              <>
                <Link to="/stores">Stores</Link>
                <Link to="/update-password">Update Password</Link>
              </>
            )}
            {user.role === 'owner' && (
              <>
                <Link to="/owner">My Store</Link>
                <Link to="/update-password">Update Password</Link>
              </>
            )}
            <div className="navbar-user-info">
              <div className="user-name-section">
                <img src={Logo} alt="User" className="user-icon" />

                <span className="navbar-username"> {user.name}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>


          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
