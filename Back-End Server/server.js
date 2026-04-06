const app = require('./server_modular_test.js');

// Handle server startup
if (app && app.listen) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} else {
  console.error('Server module not found or not properly exported');
}
