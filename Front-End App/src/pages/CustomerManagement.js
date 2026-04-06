import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gst_registered: false,
    gst_number: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await customerAPI.update(editingId, formData);
        setSuccess('Customer updated successfully');
      } else {
        await customerAPI.create(formData);
        setSuccess('Customer created successfully');
      }
      
      resetForm();
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save customer');
      console.error('Error:', err);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      gst_registered: customer.gst_registered,
      gst_number: customer.gst_number || ''
    });
    setEditingId(customer.id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        setSuccess('Customer deleted successfully');
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      gst_registered: false,
      gst_number: ''
    });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="gst_registered"
                    checked={formData.gst_registered}
                    onChange={handleInputChange}
                  />{' '}
                  GST Registered
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="gst_number">GST Number</label>
                <input
                  type="text"
                  id="gst_number"
                  name="gst_number"
                  className="form-control"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                  disabled={!formData.gst_registered}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Customer' : 'Add Customer'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Customer List</h2>
        
        {customers.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            No customers found
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>GST Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    {customer.gst_registered ? (
                      <span style={{ color: '#28a745' }}>Yes ({customer.gst_number})</span>
                    ) : (
                      <span style={{ color: '#dc3545' }}>No</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(customer.id)}
                      style={{ marginLeft: '5px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
