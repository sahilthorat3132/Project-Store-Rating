import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    users: 0,
    stores: 0,
    ratings: 0
  });

  const token = localStorage.getItem("token");
  console.log("Auth Token:", token); // Debugging

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log("Dashboard data:", res.data); // Debugging
        setSummary({
          users: res.data.userCount,
          stores: res.data.storeCount,
          ratings: res.data.ratingCount
        });
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err.response?.data || err.message);
      });
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">System Administrator Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card blue">
          <h2>Total Users</h2>
          <p>{summary.users}</p>
        </div>

        <div className="dashboard-card green">
          <h2>Total Stores</h2>
          <p>{summary.stores}</p>
        </div>

        <div className="dashboard-card purple">
          <h2>Total Ratings</h2>
          <p>{summary.ratings}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
