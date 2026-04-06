# LogiEdge Billing Dashboard

A comprehensive billing application for managing invoices, customers, and items with GST calculation functionality.

## 🚀 Features

- **Customer Management**: Create, read, update, and delete customers with GST registration status
- **Item Catalog**: Read-only master data with 7 predefined items
- **Invoice Generation**: Create invoices with automatic invoice ID generation (INVC + 6 digits)
- **GST Calculation**: Automatic 18% GST for non-GST registered customers, 0% for GST registered
- **Dashboard**: View statistics, search invoices, and filter by customer
- **Modern UI**: Clean, responsive design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: Mock data (no database required)
- **Styling**: Custom CSS with modern design

## 📦 Master Data

The application uses 7 predefined items from Excel:

| Item Code | Item Name | Price | Status |
|-----------|-----------|--------|--------|
| IT00001 | Laptop | ₹85,000 | Active |
| IT00002 | LED Monitor | ₹13,450 | Active |
| IT00003 | Pen Drive | ₹980 | Active |
| IT00004 | Mobile | ₹18,900 | Active |
| IT00005 | Headphone | ₹2,350 | Inactive |
| IT00006 | Bagpack | ₹1,200 | Active |
| IT00007 | Powerbank | ₹1,400 | Active |

## 💡 GST Logic

- **GST Registered Customers**: 0% GST applied
- **Non-GST Customers**: 18% GST applied automatically

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahilvijayvergiya/LogiEdge-Billing-Dashboard.git
   cd LogiEdge-Billing-Dashboard
   ```

2. **Install Backend Dependencies**
   ```bash
   cd "Back-End Server"
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd "../Front-End App"
   npm install
   ```

4. **Start the Application**
   
   **Backend Server:**
   ```bash
   cd "../Back-End Server"
   npm start
   ```
   
   **Frontend Application:**
   ```bash
   cd "../Front-End App"
   npm start
   ```

## 🌐 Access

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
LogiEdge-Billing-Dashboard/
├── Back-End Server/
│   ├── server.js                    # Entry point
│   ├── server_modular_test.js       # Main server with API endpoints
│   ├── package.json                 # Dependencies
│   └── .env                         # Environment variables
├── Front-End App/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js            # Navigation header
│   │   │   └── Navigation.js        # Navigation menu
│   │   ├── pages/
│   │   │   ├── Dashboard.js         # Dashboard with statistics
│   │   │   ├── CustomerManagement.js # Customer CRUD
│   │   │   ├── ItemManagement.js    # Item catalog (read-only)
│   │   │   ├── Billing.js           # Invoice creation
│   │   │   ├── InvoiceView.js       # Invoice details
│   │   │   └── MasterDataImport.js  # Master data view
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.js                   # Main application
│   │   └── index.js                 # Entry point
│   └── package.json
├── database_schema_postgresql.sql    # Database schema (for future use)
└── README.md
```

## 🔧 API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Items (Read-only)
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/invoice-id/:invoiceId` - Get invoice by invoice ID
- `GET /api/invoices/customer/:customerId` - Get invoices by customer
- `POST /api/invoices` - Create new invoice

## 🎯 Usage

### 1. Customer Management
- Navigate to Customers page
- Add new customers with GST registration details
- Edit or delete existing customers

### 2. Create Invoices
- Navigate to Billing page
- Select customer (GST status affects tax calculation)
- Add items from master data catalog
- Automatic GST calculation based on customer GST status
- Generate invoice with unique ID (INVC + 6 digits)

### 3. Dashboard
- View overall statistics (revenue, invoice counts)
- Search invoices by invoice ID
- Filter invoices by customer
- Quick access to create new invoices

### 4. Master Data
- View item catalog with pricing
- Master data is read-only (from Excel file)
- 7 predefined items with active/inactive status

## 🎨 Features

### ✅ Implemented
- Customer CRUD operations
- Invoice creation with GST logic
- Dashboard with real-time statistics
- Search and filter functionality
- Modern, responsive UI
- Self-written code style
- Master data integration

### 🔮 Future Enhancements
- User authentication
- Advanced reporting
- Email notifications
- Multi-currency support
- Database persistence
- Export functionality

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflict**
   ```bash
   # Kill existing Node.js processes
   Stop-Process -Name node -Force
   # Restart servers
   ```

2. **Module Not Found**
   ```bash
   # Reinstall dependencies
   npm install
   ```

3. **Compilation Errors**
   - Check for ESLint errors in the console
   - Ensure all dependencies are installed

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Sahil Vijay Vergiya**
- GitHub: [@Sahilvijayvergiya](https://github.com/Sahilvijayvergiya)

## 🙏 Acknowledgments

- React documentation and community
- Express.js framework
- Modern CSS techniques and best practices

---

**🎉 Thank you for checking out the LogiEdge Billing Dashboard!**

Feel free to fork, contribute, or raise issues for any improvements.
