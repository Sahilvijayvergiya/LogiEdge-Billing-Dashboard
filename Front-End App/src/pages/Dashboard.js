import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoiceAPI, customerAPI } from '../services/api';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    Promise.all([
      invoiceAPI.getAll(),
      customerAPI.getAll()
    ])
    .then(([invoicesRes, customersRes]) => {
      setInvoices(invoicesRes.data);
      setCustomers(customersRes.data);
    })
    .catch(err => {
      console.error('Failed to load data:', err);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  function handleSearch() {
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    invoiceAPI.getByInvoiceId(searchTerm.trim())
      .then(response => {
        setInvoices([response.data]);
      })
      .catch(err => {
        console.error('Search failed:', err);
        setInvoices([]);
      });
  }

  function handleCustomerInvoices(customerId) {
    invoiceAPI.getByCustomerId(customerId)
      .then(response => {
        setInvoices(response.data);
      })
      .catch(err => {
        console.error('Failed to load customer invoices:', err);
      });
  }

  function calculateStats() {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
    
    return { totalRevenue, paidInvoices, pendingInvoices, totalInvoices: invoices.length };
  }

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const { totalRevenue, paidInvoices, pendingInvoices, totalInvoices } = calculateStats();

  return (
    <div>
      <div className="card">
        <h2>Dashboard</h2>
        
        <div className="row">
          <div className="col-3">
            <div className="card text-center" style={{ backgroundColor: '#e3f2fd' }}>
              <h4>₹{totalRevenue.toFixed(2)}</h4>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="col-3">
            <div className="card text-center" style={{ backgroundColor: '#e8f5e8' }}>
              <h4>{totalInvoices}</h4>
              <p>Total Invoices</p>
            </div>
          </div>
          <div className="col-3">
            <div className="card text-center" style={{ backgroundColor: '#fff3e0' }}>
              <h4>{paidInvoices}</h4>
              <p>Paid Invoices</p>
            </div>
          </div>
          <div className="col-3">
            <div className="card text-center" style={{ backgroundColor: '#ffebee' }}>
              <h4>{pendingInvoices}</h4>
              <p>Pending Invoices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Search Invoices</h3>
        <div className="search-section">
          <div className="search-input-group">
            <input 
              type="text"
              className="search-input"
              placeholder="Enter Invoice ID (e.g., INVC000001)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
            {searchTerm && (
              <button className="btn btn-secondary clear-btn" onClick={() => { setSearchTerm(''); loadData(); }}>
                ✖ Clear
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="search-info">
              Searching for: <strong>"{searchTerm}"</strong>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Filter by Customer</h3>
        <div className="filter-section">
          <select 
            className="filter-select"
            onChange={(e) => e.target.value ? handleCustomerInvoices(e.target.value) : loadData()}
          >
            <option value="">👥 All Customers</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.gst_registered ? '📋 (GST)' : '📝 (Non-GST)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="dashboard-header">
          <h3>Recent Invoices ({invoices.length})</h3>
          <Link to="/billing" className="btn btn-success create-invoice-btn">
            ➕ Create New Invoice
          </Link>
        </div>
        
        {invoices.length === 0 ? (
          <div className="no-invoices">
            <div className="no-invoices-icon">📄</div>
            <h4>No invoices found</h4>
            <p>Try adjusting your search or filter criteria</p>
            <button className="btn btn-primary" onClick={() => { setSearchTerm(''); loadData(); }}>
              View All Invoices
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td><strong>{invoice.invoice_id}</strong></td>
                    <td>{invoice.customer_name}</td>
                    <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                    <td>₹{invoice.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${
                        invoice.status === 'paid' ? 'badge-success' : 
                        invoice.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/invoice/${invoice.id}`} className="btn btn-sm btn-primary">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="text-center mt-3">
        <Link to="/billing" className="btn btn-primary">
          Create New Invoice
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
