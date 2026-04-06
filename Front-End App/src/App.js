import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import ItemManagement from './pages/ItemManagement';
import MasterDataImport from './pages/MasterDataImport';
import Billing from './pages/Billing';
import InvoiceView from './pages/InvoiceView';

function App() {
  return (
    <div className="App">
      <Header />
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/items" element={<ItemManagement />} />
          <Route path="/master-data" element={<MasterDataImport />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoice/:id" element={<InvoiceView />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
