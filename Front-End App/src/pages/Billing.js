import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI, itemAPI, invoiceAPI } from '../services/api';

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
    Promise.all([
      customerAPI.getAll(),
      itemAPI.getAll()
    ])
    .then(([customersRes, itemsRes]) => {
      setCustomers(customersRes.data);
      setItems(itemsRes.data);
    })
    .catch(err => {
      setError('Failed to load data');
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
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
    <div>
      <div className="card">
        <h2>Create Invoice</h2>
        
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Customer</label>
            <select 
              value={selectedCustomer} 
              onChange={(e) => handleCustomerChange(e.target.value)}
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.gst_registered ? '(GST)' : '(Non-GST)'}
                </option>
              ))}
            </select>
          </div>

          <div className="card">
            <h3>Items</h3>
            
            {invoiceItems.map((item, index) => (
              <div key={index} className="row">
                <div className="col-4">
                  <select 
                    value={item.item_id}
                    onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                    required
                  >
                    <option value="">Select item...</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - ₹{item.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-3">
                  <input 
                    type="number" 
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    required
                  />
                </div>
                <div className="col-3">
                  <input 
                    type="number" 
                    placeholder="Price"
                    value={item.unit_price}
                    readOnly
                  />
                </div>
                <div className="col-2">
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              type="button" 
              className="btn btn-secondary mt-2"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Additional notes for the invoice..."
            />
          </div>

          {invoiceItems.length > 0 && (
            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <h3>Invoice Summary</h3>
              <div className="invoice-summary">
                <div><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</div>
                {selectedCustomer && !selectedCustomer.gst_registered && (
                  <div><strong>GST (18%):</strong> ₹{gstAmount.toFixed(2)}</div>
                )}
                <div className="total"><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={!selectedCustomer || invoiceItems.length === 0}>
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Billing;
