import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUserListPage.css'; // ✅ Import CSS

function AdminUserListPage() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchUsers = () => {
    const params = {
      ...filters,
      sortBy,
      sortOrder
    };

    axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  // Load users immediately on first render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounce filter/sort changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [filters, sortBy, sortOrder]);



  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="admin-user-list">
      <h2>User List</h2>

      <div>
        <input name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('name')}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('email')}>Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('address')}>Address {sortBy === 'address' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('role')}>Role {sortBy === 'role' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserListPage;
