import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OwnerDashboard.css'; //  custom styling

function OwnerDashboard() {
  const token = localStorage.getItem('token');
  const [storeRatingsData, setStoreRatingsData] = useState([]);

  const fetchStoreRatings = () => {
    axios.get('http://localhost:5000/api/stores/owner-ratings', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("API Response:", res.data); 
      setStoreRatingsData(res.data);
    })
    .catch(err => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchStoreRatings();
  }, []);

  return (
    <div className="owner-dashboard">
      <h2>Owner Dashboard</h2>

      <div className="section">
        <h3>Your Store Ratings</h3>

        {storeRatingsData.length === 0 ? (
          <p>No ratings yet.</p>
        ) : (
          storeRatingsData.map((store, index) => {
            console.log("Store:", store);
            return (
              <div key={index} className="store-section">
                <h4>{store.store}</h4>
                <p><strong>Average Rating:</strong> {store.averageRating}</p>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.ratedBy.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{entry.user}</td>
                        <td>{entry.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>

      <div className="section">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default OwnerDashboard;
