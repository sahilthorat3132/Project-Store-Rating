import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StoreListPage.css';

function StoreListPage() {
  const token = localStorage.getItem('token');
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [userRatings, setUserRatings] = useState({});
  const [editingRating, setEditingRating] = useState(null);


  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ratings/mine', {
  headers: { Authorization: `Bearer ${token}` }
});
      const ratingsMap = {};
      res.data.forEach(r => {
        ratingsMap[r.storeId] = r.rating_value;
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await axios.post(
        `http://localhost:5000/api/ratings/${storeId}`,
        { rating_value: rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserRatings();
    } catch (err) {
      console.error(err);
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="store-list-page">
      <h2>All Stores</h2>

      <div className="filter-section">
        <input name="name" placeholder="Search by Name" value={filters.name} onChange={handleFilterChange} />
        <input name="address" placeholder="Search by Address" value={filters.address} onChange={handleFilterChange} />
      </div>
      

      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.averageRating}</td>
              <td>{userRatings[store.id] || 'Not Rated'}</td>
              <td>
                {editingRating === store.id ? (
                  <>
                    <select onChange={e => handleRatingSubmit(store.id, parseInt(e.target.value))} defaultValue={userRatings[store.id] || 0}>
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button onClick={() => setEditingRating(null)}>Done</button>
                  </>
                ) : (
                  <button onClick={() => setEditingRating(store.id)}>
                    {userRatings[store.id] ? 'Edit Rating' : 'Rate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StoreListPage;
