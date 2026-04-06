-- Billing Dashboard Database Schema for PostgreSQL

-- Customers Master Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    gst_registered BOOLEAN DEFAULT FALSE,
    gst_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items Master Table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'pcs',
    hsn_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(10) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    subtotal DECIMAL(10, 2) NOT NULL,
    gst_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice Items Table (Line items for each invoice)
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample customers
INSERT INTO customers (name, email, phone, address, gst_registered, gst_number) VALUES
('ABC Corporation', 'abc@corp.com', '9876543210', '123 Business Park, Mumbai', TRUE, '27AAAPL1234C1ZV'),
('XYZ Enterprises', 'xyz@enterprise.com', '9876543211', '456 Industrial Area, Delhi', FALSE, NULL),
('Global Solutions', 'global@solutions.com', '9876543212', '789 Tech Hub, Bangalore', TRUE, '29AAAPG5678B1ZY'),
('Local Traders', 'local@traders.com', '9876543213', '321 Market Street, Chennai', FALSE, NULL),
('Tech Innovators', 'tech@innovators.com', '9876543214', '654 Innovation Park, Hyderabad', TRUE, '36AAAPT9012C1ZW')
ON CONFLICT (email) DO NOTHING;

-- Insert sample items (from master data)
INSERT INTO items (item_code, name, description, price, unit, hsn_code, is_active) VALUES
('IT00001', 'Laptop', 'High-performance laptop for business use', 85000.00, 'pcs', '8471', TRUE),
('IT00002', 'LED Monitor', '24-inch LED monitor', 13450.00, 'pcs', '8528', TRUE),
('IT00003', 'Pen Drive', '64GB USB pen drive', 980.00, 'pcs', '8523', TRUE),
('IT00004', 'Mobile', 'Smartphone with latest features', 18900.00, 'pcs', '8517', TRUE),
('IT00005', 'Headphone', 'Wireless headphones', 2350.00, 'pcs', '8518', FALSE),
('IT00006', 'Bagpack', 'Laptop backpack with multiple compartments', 1200.00, 'pcs', '4202', TRUE),
('IT00007', 'Powerbank', 'Portable power bank 20000mAh', 1400.00, 'pcs', '8507', TRUE)
ON CONFLICT (item_code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_gst ON customers(gst_registered);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_code ON items(item_code);
CREATE INDEX IF NOT EXISTS idx_items_active ON items(is_active);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_id ON invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_item ON invoice_items(item_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
