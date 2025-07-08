import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasswordUpdatePage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/password', 
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password updated successfully');
      navigate('/update-password');
    } catch (err) {
      alert(err.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          pattern="(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}"
          title="8-16 characters, at least one uppercase letter and one special character"
          required
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default PasswordUpdatePage;
