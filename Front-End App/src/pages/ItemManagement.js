import React, { useState, useEffect } from 'react';
import { itemAPI } from '../services/api';

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemAPI.getAll();
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getActiveStatus = (isActive) => {
    return isActive ? (
      <span style={{ color: '#28a745', fontWeight: 'bold' }}>Active</span>
    ) : (
      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Inactive</span>
    );
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Item Management - Master Data (Read-Only)</h2>
        
        <div className="alert alert-info">
          <strong>📊 Master Data Status:</strong> Read-only view from Excel file
          <br />
          <strong>Items:</strong> {items.length} items from master data
          <br />
          <strong>Note:</strong> Items cannot be added, edited, or deleted here. Master data is managed only through the Excel file.
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Unit</th>
                <th>HSN Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.item_code}</strong></td>
                  <td>{item.name}</td>
                  <td>{item.description || '-'}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.unit}</td>
                  <td>{item.hsn_code || '-'}</td>
                  <td>{getActiveStatus(item.is_active)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            No items found in master data
          </div>
        )}

        <div className="mt-3">
          <h3>Master Data Summary</h3>
          <div className="row">
            <div className="col-4">
              <div className="card text-center" style={{ backgroundColor: '#e3f2fd' }}>
                <h4>{items.length}</h4>
                <p>Total Items</p>
              </div>
            </div>
            <div className="col-4">
              <div className="card text-center" style={{ backgroundColor: '#e8f5e8' }}>
                <h4>{items.filter(item => item.is_active).length}</h4>
                <p>Active Items</p>
              </div>
            </div>
            <div className="col-4">
              <div className="card text-center" style={{ backgroundColor: '#fff3e0' }}>
                <h4>{items.filter(item => !item.is_active).length}</h4>
                <p>Inactive Items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <a href="/master-data" className="btn btn-info">
            View Master Data Details
          </a>
          <a href="/billing" className="btn btn-success ml-2">
            Create Invoice with Items
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;
