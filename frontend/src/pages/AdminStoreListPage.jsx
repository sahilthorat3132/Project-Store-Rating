import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminStoreListPage.css';

function AdminStoreListPage() {
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = () => {
    const params = {
      ...filters,
      sortBy,
      sortOrder
    };

    axios
      .get('http://localhost:5000/api/admin/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params
      })
      .then(res => setStores(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStores(); // Initial load
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchStores(); // Fetch after filter/sort change
    }, 300);

    return () => clearTimeout(debounce);
  }, [filters, sortBy, sortOrder]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="admin-store-list">
      <h2>Store List</h2>

      <div className="filters">
        <input name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('name')}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSortChange('email')}>
              Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSortChange('address')}>
              Address {sortBy === 'address' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSortChange('rating')}>
              Average Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => (
            <tr key={index}>
              <td>{store.name}</td>
              <td>{store.email || '—'}</td>
              <td>{store.address}</td>
              <td>{store.rating || 'No ratings'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminStoreListPage;
