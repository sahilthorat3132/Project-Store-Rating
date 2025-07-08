import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg(''); // Clear error on change
  };

  const validateForm = () => {
    const { name, email, address, password } = form;

    if (name.length < 2 || name.length > 60) {
      return 'Name must be between 2 and 60 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format.';
    }

    if (address.length > 400) {
      return 'Address must not exceed 400 characters.';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be 8-16 characters and include at least one uppercase letter and one special character.';
    }

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
