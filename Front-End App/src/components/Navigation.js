import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="nav-container">
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/customers" className="nav-link">
          Customers
        </NavLink>
        <NavLink to="/items" className="nav-link">
          Items
        </NavLink>
        <NavLink to="/master-data" className="nav-link">
          Master Data
        </NavLink>
        <NavLink to="/billing" className="nav-link">
          Billing
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
