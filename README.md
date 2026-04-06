# LogiEdge Billing Dashboard

LogiEdge Billing Dashboard is a simple full-stack billing application built using React and Node.js.  
It allows users to manage customers, generate invoices, and apply GST automatically based on customer registration status.

The project currently runs using mock data and is structured so it can be easily connected to PostgreSQL in future versions.

---

## Features

- Customer management (Add, Update, Delete)
- Invoice generation with automatic invoice ID creation
- GST calculation based on customer registration status
- Dashboard with billing statistics
- Search invoices by invoice ID
- Filter invoices by customer
- Read-only master item catalog
- Responsive UI design

Invoice IDs are generated automatically in the format:

```
INVC000001
```

---

## Tech Stack

**Frontend**

- React 18
- React Router
- Axios
- Custom CSS

**Backend**

- Node.js
- Express.js

**Database**

- Mock data (PostgreSQL schema included for future use)

---

## Master Item Data

The system includes 7 predefined catalog items:

| Item Code | Item Name | Price | Status |
|-----------|-----------|-------|--------|
| IT00001 | Laptop | ₹85,000 | Active |
| IT00002 | LED Monitor | ₹13,450 | Active |
| IT00003 | Pen Drive | ₹980 | Active |
| IT00004 | Mobile | ₹18,900 | Active |
| IT00005 | Headphone | ₹2,350 | Inactive |
| IT00006 | Bagpack | ₹1,200 | Active |
| IT00007 | Powerbank | ₹1,400 | Active |

Items behave as master data and cannot be modified from the UI.

---

## GST Logic

GST calculation depends on customer registration:

- GST registered customers → 0% GST applied
- Non-GST customers → 18% GST applied automatically

---

## Project Setup

### Clone repository

```
git clone https://github.com/Sahilvijayvergiya/LogiEdge-Billing-Dashboard.git
cd LogiEdge-Billing-Dashboard
```

### Install backend dependencies

```
cd "Back-End Server"
npm install
```

### Install frontend dependencies

```
cd "../Front-End App"
npm install
```

### Start backend server

```
cd "../Back-End Server"
npm start
```

### Start frontend server

```
cd "../Front-End App"
npm start
```

---

## Application URLs

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:5000
```

---

## API Endpoints

### Customers

```
GET /api/customers
GET /api/customers/:id
POST /api/customers
PUT /api/customers/:id
DELETE /api/customers/:id
```

### Items

```
GET /api/items
GET /api/items/:id
```

### Invoices

```
GET /api/invoices
GET /api/invoices/:id
GET /api/invoices/invoice-id/:invoiceId
GET /api/invoices/customer/:customerId
POST /api/invoices
```

---

## Folder Structure

```
LogiEdge-Billing-Dashboard
│
├── Back-End Server
│   ├── server.js
│   ├── server_modular_test.js
│   └── package.json
│
├── Front-End App
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       ├── App.js
│       └── index.js
│
└── database_schema_postgresql.sql
```

---

## Future Improvements

Planned enhancements:

- Authentication system
- PostgreSQL integration
- Export invoices as PDF
- Email invoice sharing
- Reporting dashboard
- Multi-currency support

---

## Author

**Sahil Vijay Vergiya**

GitHub:
https://github.com/Sahilvijayvergiya
