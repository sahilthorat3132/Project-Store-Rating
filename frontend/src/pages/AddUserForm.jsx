import React, { useState } from "react";
import axios from "axios";
import "./AddUserForm.css";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user"
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.length < 2 || formData.name.length > 60) {
      newErrors.name = "Name must be between 2 and 60 characters.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Address validation
    if (!formData.address || formData.address.length > 400) {
      newErrors.address = "Address must be under 400 characters.";
    }

    // Password validation
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!formData.password || !passRegex.test(formData.password)) {
      newErrors.password = "Password must be 8–16 chars, with 1 uppercase & 1 special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/admin/users", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess("User created successfully!");
      setFormData({ name: "", email: "", address: "", password: "", role: "user" });
      setErrors({});
    } catch (error) {
      alert(error.response?.data?.message || "Error creating user.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New User</h2>
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        {errors.address && <span className="error">{errors.address}</span>}

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="admin">Admin User</option>
        </select>

        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUserForm;
