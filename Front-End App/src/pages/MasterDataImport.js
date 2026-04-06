import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MasterDataImport = () => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Master data from your Excel file - READ ONLY
  const excelMasterData = [
    { ItemCode: 'IT00001', ItemName: 'Laptop', SellingPrice: 85000, IsActive: 'Y' },
    { ItemCode: 'IT00002', ItemName: 'LED Monitor', SellingPrice: 13450, IsActive: 'Y' },
    { ItemCode: 'IT00003', ItemName: 'Pen Drive', SellingPrice: 980, IsActive: 'Y' },
    { ItemCode: 'IT00004', ItemName: 'Mobile', SellingPrice: 18900, IsActive: 'Y' },
    { ItemCode: 'IT00005', ItemName: 'Headphone', SellingPrice: 2350, IsActive: 'N' },
    { ItemCode: 'IT00006', ItemName: 'Bagpack', SellingPrice: 1200, IsActive: 'Y' },
    { ItemCode: 'IT00007', ItemName: 'Powerbank', SellingPrice: 1400, IsActive: 'Y' }
  ];

  useEffect(() => {
    // Load master data from Excel
    setMasterData(excelMasterData);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getActiveStatus = (isActive) => {
    return isActive === 'Y' ? (
      <span style={{ color: '#28a745', fontWeight: 'bold' }}>Active</span>
    ) : (
      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Inactive</span>
    );
  };

  return (
    <div>
      <div className="card">
        <h2>Master Data - Items Catalog</h2>
        
        <div className="alert alert-info">
          <strong>📊 Master Data Source:</strong> Excel file with 7 items
          <br />
          <strong>Status:</strong> Read-only view of imported master data
        </div>

        <div className="row">
          <div className="col-12">
            <h3>Excel Master Data Overview</h3>
            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Selling Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {excelMasterData.map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.ItemCode}</strong></td>
                      <td>{item.ItemName}</td>
                      <td>{formatPrice(item.SellingPrice)}</td>
                      <td>{getActiveStatus(item.IsActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h3>Master Data Statistics</h3>
          <div className="row">
            <div className="col-4">
              <div className="card text-center" style={{ backgroundColor: '#e3f2fd' }}>
                <h4>{excelMasterData.length}</h4>
                <p>Total Items</p>
              </div>
            </div>
            <div className="col-4">
              <div className="card text-center" style={{ backgroundColor: '#e8f5e8' }}>
                <h4>{excelMasterData.filter(item => item.IsActive === 'Y').length}</h4>
                <p>Active Items</p>
              </div>
            </div>
            <div className="col-4">
              <div className="card text-center" style={{ backgroundColor: '#fff3e0' }}>
                <h4>{excelMasterData.filter(item => item.IsActive === 'N').length}</h4>
                <p>Inactive Items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h3>Expected Excel Format</h3>
          <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ItemCode</th>
                  <th>ItemName</th>
                  <th>SellingPrice</th>
                  <th>IsActive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IT00001</td>
                  <td>Laptop</td>
                  <td>85000</td>
                  <td>Y</td>
                </tr>
                <tr>
                  <td>IT00002</td>
                  <td>LED Monitor</td>
                  <td>13450</td>
                  <td>Y</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Current Master Data in System</h3>
        
        {masterData.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            No master data available
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Selling Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {masterData.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.ItemCode}</strong></td>
                  <td>{item.ItemName}</td>
                  <td>{formatPrice(item.SellingPrice)}</td>
                  <td>{getActiveStatus(item.IsActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="text-center mt-3">
          <Link to="/items" className="btn btn-primary">
            View Items in Catalog
          </Link>
          <Link to="/billing" className="btn btn-success ml-2">
            Create Invoice with Master Data
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MasterDataImport;
