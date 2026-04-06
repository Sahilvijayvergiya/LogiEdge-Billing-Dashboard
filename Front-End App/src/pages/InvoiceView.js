import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../services/api';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await invoiceAPI.getById(id);
      setInvoice(response.data);
    } catch (err) {
      setError('Failed to fetch invoice details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await invoiceAPI.updateStatus(id, newStatus);
      setInvoice(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Failed to update invoice status');
      console.error('Error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="card">
        <div className="alert alert-error">{error || 'Invoice not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Invoice Details</h2>
          <div>
            <button className="btn btn-primary" onClick={handlePrint}>
              Print Invoice
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard')}
              style={{ marginLeft: '10px' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="invoice-header">
          <div className="row">
            <div className="col-6">
              <h1 style={{ color: '#667eea', fontSize: '2rem', marginBottom: '10px' }}>
                INVOICE
              </h1>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {invoice.invoice_id}
              </p>
            </div>
            <div className="col-6 text-right">
              <p><strong>Date:</strong> {formatDate(invoice.invoice_date)}</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${getStatusBadgeClass(invoice.status)}`} style={{ marginLeft: '10px' }}>
                  {invoice.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="invoice-details">
          <div className="row">
            <div className="col-6">
              <h3>Bill To:</h3>
              <p><strong>{invoice.customer_name}</strong></p>
              <p>{invoice.customer_email}</p>
              <p>{invoice.customer_phone}</p>
              <p>{invoice.customer_address || 'N/A'}</p>
            </div>
            <div className="col-6 text-right">
              <h3>Payment Status:</h3>
              <div style={{ marginTop: '20px' }}>
                {invoice.status !== 'paid' && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate('paid')}
                  >
                    Mark as Paid
                  </button>
                )}
                {invoice.status === 'pending' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate('overdue')}
                    style={{ marginLeft: '10px' }}
                  >
                    Mark as Overdue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <strong>{item.item_name}</strong>
                  {item.item_description && (
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      {item.item_description}
                    </div>
                  )}
                </td>
                <td>{item.quantity}</td>
                <td>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                <td>₹{parseFloat(item.total_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <div><strong>Subtotal:</strong> ₹{parseFloat(invoice.subtotal).toFixed(2)}</div>
          {parseFloat(invoice.gst_amount) > 0 && (
            <div><strong>GST (18%):</strong> ₹{parseFloat(invoice.gst_amount).toFixed(2)}</div>
          )}
          <div className="total">
            <strong>Total Amount:</strong> ₹{parseFloat(invoice.total_amount).toFixed(2)}
          </div>
        </div>

        {invoice.notes && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h4>Notes:</h4>
            <p>{invoice.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
          <p>Thank you for your business!</p>
          <p>For any queries, please contact us at: billing@logiedge.com</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
