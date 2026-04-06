import React, { useState, useEffect } from 'react';
import { customerAPI, itemAPI, testAPI } from '../services/api';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPIs = async () => {
    setLoading(true);
    const testResults = {};

    try {
      console.log('Testing API endpoints...');
      
      // Test root endpoint
      try {
        const response = await fetch('https://logiedge-billing-dashboard-zqwe.onrender.com/');
        testResults.root = await response.json();
      } catch (error) {
        testResults.root = { error: error.message };
      }

      // Test test endpoint
      try {
        const response = await testAPI.test();
        testResults.test = response.data;
      } catch (error) {
        testResults.test = { error: error.message };
      }

      // Test customers
      try {
        const response = await customerAPI.getAll();
        testResults.customers = response.data;
      } catch (error) {
        testResults.customers = { error: error.message };
      }

      // Test items
      try {
        const response = await itemAPI.getAll();
        testResults.items = response.data;
      } catch (error) {
        testResults.items = { error: error.message };
      }

    } catch (error) {
      testResults.general = { error: error.message };
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h3>🔧 API Test Component</h3>
      <button onClick={testAPIs} disabled={loading}>
        {loading ? 'Testing...' : 'Test All APIs'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Results:</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApiTest;
