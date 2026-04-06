# Billing Dashboard

A simple billing application for managing invoices, customers, and items.

## Features

- Customer management
- Item catalog with master data
- Invoice creation with GST calculation
- Dashboard with statistics
- Search and filter functionality

## Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Database: Mock data (no database required)

## Getting Started

### Backend
```bash
cd "Back-End Server"
npm install
npm start
```

### Frontend
```bash
cd "Front-End App"
npm install
npm start
```

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Master Data

The application uses 7 predefined items:
- Laptop (₹85,000)
- LED Monitor (₹13,450)
- Pen Drive (₹980)
- Mobile (₹18,900)
- Headphone (₹2,350)
- Bagpack (₹1,200)
- Powerbank (₹1,400)

## GST Logic

- GST Registered customers: 0% GST
- Non-GST customers: 18% GST

## Project Structure

```
Billing Dashboard/
├── Back-End Server/
│   ├── server.js
│   ├── server_modular_test.js
│   └── package.json
├── Front-End App/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Usage

1. Add customers with GST registration status
2. Create invoices by selecting customers and items
3. View dashboard statistics
4. Search and filter invoices

## Notes

- Items are read-only (from master data)
- Uses mock data for simplicity
- No database setup required

## Support

For any issues or questions, please refer to the code documentation or contact the development team.

---

**Note**: This project was developed as a demonstration of full-stack web development capabilities using React, Node.js, and MySQL.
