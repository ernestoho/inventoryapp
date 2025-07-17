-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');

-- Order status enum
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled');

-- Transaction type enum
CREATE TYPE transaction_type AS ENUM ('purchase', 'sale', 'production', 'adjustment', 'transfer');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    currency TEXT DEFAULT 'USD',
    payment_terms INTEGER DEFAULT 30,
    lead_time_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    country TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update the seed data to reflect the client's specific requirements

-- Replace the existing locations with Amazon storage locations
DELETE FROM locations;
INSERT INTO locations (id, name, address, city, country) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Amazon Bebidas', 'Main Storage - Beverages', 'Location', 'Country'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Amazon Comida', 'Main Storage - Food', 'Location', 'Country'),
    ('770e8400-e29b-41d4-a716-446655440003', 'Amazon Desechables', 'Main Storage - Disposables', 'Location', 'Country'),
    ('770e8400-e29b-41d4-a716-446655440004', 'Bar Principal', 'Main Bar Area', 'Location', 'Country'),
    ('770e8400-e29b-41d4-a716-446655440005', 'Bar Terraza', 'Terrace Bar', 'Location', 'Country'),
    ('770e8400-e29b-41d4-a716-446655440006', 'Cocina Principal', 'Main Kitchen', 'Location', 'Country'),
    ('770e8400-e29b-41d4-a716-446655440007', 'Cocina Fría', 'Cold Kitchen', 'Location', 'Country');

-- Add location types to distinguish storage vs operational locations
ALTER TABLE locations ADD COLUMN location_type TEXT DEFAULT 'operational';
UPDATE locations SET location_type = 'storage' WHERE name LIKE 'Amazon%';
UPDATE locations SET location_type = 'bar' WHERE name LIKE 'Bar%';
UPDATE locations SET location_type = 'kitchen' WHERE name LIKE 'Cocina%';

-- Items table
CREATE TABLE items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    unit_of_measure TEXT DEFAULT 'pcs',
    cost_price DECIMAL(10,2) DEFAULT 0,
    selling_price DECIMAL(10,2) DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    preferred_supplier_id UUID REFERENCES suppliers(id),
    is_active BOOLEAN DEFAULT true,
    is_raw_material BOOLEAN DEFAULT false,
    requires_batch_tracking BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update items table for restaurant/bar specific fields
ALTER TABLE items ADD COLUMN is_sales_item BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN sales_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE items ADD COLUMN recipe_yield DECIMAL(10,3) DEFAULT 1; -- For recipes, how many servings
ALTER TABLE items ADD COLUMN alcohol_content DECIMAL(5,2) DEFAULT 0; -- For beverages

-- Inventory table
CREATE TABLE inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    batch_number TEXT,
    manufacture_date DATE,
    expiry_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, location_id, batch_number)
);

-- Purchase orders table
CREATE TABLE purchase_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    po_number TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    status order_status DEFAULT 'draft',
    order_date DATE DEFAULT CURRENT_DATE,
    expected_date DATE,
    received_date DATE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase order items table
CREATE TABLE purchase_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    batch_number TEXT,
    manufacture_date DATE,
    expiry_date DATE
);

-- Sales table
CREATE TABLE sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sale_number TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    location_id UUID REFERENCES locations(id) NOT NULL,
    sale_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update sales table for restaurant operations
ALTER TABLE sales ADD COLUMN table_number TEXT;
ALTER TABLE sales ADD COLUMN server_name TEXT;
ALTER TABLE sales ADD COLUMN payment_method TEXT DEFAULT 'cash';

-- Sale items table
CREATE TABLE sale_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    batch_number TEXT
);

-- Update sale_items to reference sales_items instead of inventory items
ALTER TABLE sale_items DROP COLUMN item_id;
ALTER TABLE sale_items ADD COLUMN sales_item_id UUID REFERENCES sales_items(id);
ALTER TABLE sale_items ADD COLUMN quantity DECIMAL(10,3) NOT NULL DEFAULT 1;

-- Sales items table (menu items)
CREATE TABLE sales_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- bebidas, comida, postres, etc.
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    preparation_time INTEGER DEFAULT 0, -- minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    output_item_id UUID REFERENCES items(id) NOT NULL,
    output_quantity INTEGER DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update recipes to link to sales items instead of inventory items
ALTER TABLE recipes DROP COLUMN output_item_id;
ALTER TABLE recipes ADD COLUMN sales_item_id UUID REFERENCES sales_items(id);
ALTER TABLE recipes ADD COLUMN serving_size DECIMAL(10,3) DEFAULT 1;

-- Recipe ingredients table
CREATE TABLE recipe_ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL
);

-- Update recipe ingredients to support precise measurements
ALTER TABLE recipe_ingredients ALTER COLUMN quantity TYPE DECIMAL(10,3);
ALTER TABLE recipe_ingredients ADD COLUMN unit TEXT DEFAULT 'ml'; -- ml, gr, pcs, etc.

-- Production orders table
CREATE TABLE production_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    planned_quantity INTEGER NOT NULL,
    produced_quantity INTEGER DEFAULT 0,
    status TEXT DEFAULT 'planned',
    planned_date DATE DEFAULT CURRENT_DATE,
    started_date DATE,
    completed_date DATE,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory transactions table (audit log)
CREATE TABLE inventory_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    transaction_type transaction_type NOT NULL,
    quantity_change INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    batch_number TEXT,
    reference_id UUID, -- Can reference PO, Sale, Production Order, etc.
    reference_type TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance schedules table
CREATE TABLE maintenance_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    maintenance_type TEXT NOT NULL,
    frequency_days INTEGER NOT NULL,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reorder rules table
CREATE TABLE reorder_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES items(id) NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    min_stock INTEGER NOT NULL,
    max_stock INTEGER NOT NULL,
    reorder_quantity INTEGER NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, location_id)
);

-- Add transfer orders table for traspasos
CREATE TABLE transfer_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transfer_number TEXT UNIQUE NOT NULL,
    from_location_id UUID REFERENCES locations(id) NOT NULL,
    to_location_id UUID REFERENCES locations(id) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, in_transit, completed, cancelled
    transfer_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfer order items
CREATE TABLE transfer_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transfer_order_id UUID REFERENCES transfer_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) NOT NULL,
    quantity_requested DECIMAL(10,3) NOT NULL,
    quantity_transferred DECIMAL(10,3) DEFAULT 0,
    batch_number TEXT,
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_item_location ON inventory(item_id, location_id);
CREATE INDEX idx_inventory_transactions_item ON inventory_transactions(item_id);
CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_category ON items(category_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for new tables
-- Policies for transfer orders
CREATE POLICY "Everyone can view transfer orders" ON transfer_orders FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage transfer orders" ON transfer_orders FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Policies for transfer order items
CREATE POLICY "Everyone can view transfer order items" ON transfer_order_items FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage transfer order items" ON transfer_order_items FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Policies for sales items
CREATE POLICY "Everyone can view sales items" ON sales_items FOR SELECT USING (true);
CREATE POLICY "Managers and above can manage sales items" ON sales_items FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);
