import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI, itemAPI, invoiceAPI, testAPI } from '../services/api';

function Billing() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    setError('');
    
    // First test API connection
    testAPI().then(testResult => {
      if (!testResult.success) {
        setError(`API Connection Failed: ${testResult.error}`);
        setLoading(false);
        return;
      }
      
      // If API test passes, load data
      Promise.all([
        customerAPI.getAll(),
        itemAPI.getAll()
      ])
      .then(([customersRes, itemsRes]) => {
        console.log('Customers loaded:', customersRes.data);
        console.log('Items loaded:', itemsRes.data);
        setCustomers(customersRes.data || []);
        setItems(itemsRes.data || []);
      })
      .catch(err => {
        console.error('Load data error:', err);
        let errorMessage = 'Failed to load data';
        
        if (err.message) {
          errorMessage = err.message;
        } else if (err.response?.status === 0) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (err.response?.status === 404) {
          errorMessage = 'API endpoint not found. Please check backend deployment.';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout. Please try again.';
        }
        
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
    });
  }

  function handleCustomerChange(customerId) {
    setSelectedCustomer(customerId);
    setError('');
  }

  function handleAddItem() {
    setInvoiceItems([...invoiceItems, {
      item_id: '',
      quantity: 1,
      unit_price: 0
    }]);
  }

  function handleItemChange(index, field, value) {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    
    if (field === 'item_id') {
      const item = items.find(i => i.id === parseInt(value));
      if (item) {
        newItems[index].unit_price = item.price;
      }
    }
    
    setInvoiceItems(newItems);
  }

  function handleRemoveItem(index) {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  }

  function calculateTotals() {
    const subtotal = invoiceItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);

    const customer = customers.find(c => c.id === parseInt(selectedCustomer));
    const gstAmount = customer && !customer.gst_registered ? subtotal * 0.18 : 0;
    const totalAmount = subtotal + gstAmount;

    return { subtotal, gstAmount, totalAmount };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    if (invoiceItems.length === 0 || invoiceItems.some(item => !item.item_id || item.quantity <= 0)) {
      setError('Please add valid items');
      return;
    }

    const invoiceData = {
      customer_id: selectedCustomer,
      items: invoiceItems,
      notes: notes
    };

    invoiceAPI.create(invoiceData)
      .then(response => {
        navigate('/invoice/' + response.data.id);
      })
      .catch(err => {
        setError('Failed to create invoice');
        console.error(err);
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const { subtotal, gstAmount, totalAmount } = calculateTotals();

  return (
    <div className="billing-page">
      <div className="card billing-header">
        <h2>🧾 Create Invoice</h2>
        <p>Fill in the details below to generate a new invoice</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="billing-form">
        <div className="card customer-section">
          <h3>👤 Customer Information</h3>
          <div className="form-group">
            <label>Select Customer *</label>
            <select
              value={selectedCustomer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              required
              className="customer-select"
            >
              <option value="">Choose a customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.gst_registered ? '📋 (GST)' : '📝 (Non-GST)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card items-section">
          <div className="section-header">
            <h3>📦 Invoice Items</h3>
            <button 
              type="button" 
              className="btn btn-success add-item-btn"
              onClick={handleAddItem}
            >
              ➕ Add Item
            </button>
          </div>

          {invoiceItems.length === 0 ? (
            <div className="empty-items">
              <div className="empty-icon">📦</div>
              <h4>No items added yet</h4>
              <p>Click "Add Item" to start building your invoice</p>
            </div>
          ) : (
            <div className="items-list">
              {invoiceItems.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-select-col">
                    <select
                      value={item.item_id}
                      onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                      required
                      className="item-select"
                    >
                      <option value="">Select item...</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ₹{item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="quantity-col">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      min="1"
                      required
                      className="quantity-input"
                    />
                  </div>
                  <div className="price-col">
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price}
                      readOnly
                      className="price-input"
                    />
                  </div>
                  <div className="total-col">
                    <div className="item-total">
                      ₹{(item.quantity * item.unit_price).toFixed(2)}
                    </div>
                  </div>
                  <div className="action-col">
                    <button
                      type="button"
                      className="btn btn-danger remove-btn"
                      onClick={() => handleRemoveItem(index)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card notes-section">
          <h3>📝 Additional Notes</h3>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Add any additional notes for the invoice..."
            className="notes-textarea"
          />
        </div>

        {invoiceItems.length > 0 && (
          <div className="card summary-section">
            <h3>💰 Invoice Summary</h3>
            <div className="summary-grid">
              <div className="summary-row">
                <span className="label">Subtotal:</span>
                <span className="value">₹{subtotal.toFixed(2)}</span>
              </div>
              {selectedCustomer && !customers.find(c => c.id === parseInt(selectedCustomer))?.gst_registered && (
                <div className="summary-row gst-row">
                  <span className="label">GST (18%):</span>
                  <span className="value gst-value">₹{gstAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total-row">
                <span className="label">Total Amount:</span>
                <span className="value total-value">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary create-invoice-btn"
            disabled={!selectedCustomer || invoiceItems.length === 0}
          >
            🧾 Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default Billing;
