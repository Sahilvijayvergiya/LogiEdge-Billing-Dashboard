require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
