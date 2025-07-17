-- Clear existing data and add restaurant/bar specific data

-- Update categories for restaurant/bar
DELETE FROM categories;
INSERT INTO categories (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Bebidas Alcohólicas', 'Alcoholic beverages - rum, vodka, whiskey, etc.'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Bebidas No Alcohólicas', 'Non-alcoholic beverages - sodas, juices, water'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Comida', 'Food ingredients and prepared items'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Desechables', 'Disposable items - cups, napkins, straws'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Garnish', 'Garnishes and mixers - lime, mint, olives');

-- Update suppliers for restaurant/bar
DELETE FROM suppliers;
INSERT INTO suppliers (id, name, contact_person, email, phone, address, city, country, currency, payment_terms, lead_time_days) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Distribuidora de Licores SA', 'Carlos Mendez', 'carlos@licores.com', '+1-555-0101', 'Zona Industrial', 'Ciudad', 'País', 'USD', 30, 7),
    ('660e8400-e29b-41d4-a716-446655440002', 'Refrescos y Bebidas Ltda', 'Maria Rodriguez', 'maria@refrescos.com', '+1-555-0102', 'Av. Principal 123', 'Ciudad', 'País', 'USD', 15, 3),
    ('660e8400-e29b-41d4-a716-446655440003', 'Alimentos Frescos', 'Juan Perez', 'juan@alimentos.com', '+1-555-0103', 'Mercado Central', 'Ciudad', 'País', 'USD', 7, 2),
    ('660e8400-e29b-41d4-a716-446655440004', 'Desechables del Caribe', 'Ana Lopez', 'ana@desechables.com', '+1-555-0104', 'Zona Franca', 'Ciudad', 'País', 'USD', 30, 5);

-- Update items for restaurant/bar inventory
DELETE FROM items;
INSERT INTO items (id, sku, name, description, category_id, unit_of_measure, cost_price, selling_price, reorder_point, reorder_quantity, preferred_supplier_id, is_raw_material, requires_batch_tracking, is_sales_item, sales_price, alcohol_content) VALUES
    -- Alcoholic beverages
    ('880e8400-e29b-41d4-a716-446655440001', 'RUM-001', 'Ron Blanco', 'White rum 750ml bottle', '550e8400-e29b-41d4-a716-446655440001', 'bottle', 12.00, 0.00, 10, 24, '660e8400-e29b-41d4-a716-446655440001', true, true, false, 0.00, 40.0),
    ('880e8400-e29b-41d4-a716-446655440002', 'VODKA-001', 'Vodka Premium', 'Premium vodka 750ml bottle', '550e8400-e29b-41d4-a716-446655440001', 'bottle', 15.00, 0.00, 8, 20, '660e8400-e29b-41d4-a716-446655440001', true, true, false, 0.00, 40.0),
    ('880e8400-e29b-41d4-a716-446655440003', 'BEER-001', 'Cerveza Nacional', 'Local beer 355ml bottle', '550e8400-e29b-41d4-a716-446655440001', 'bottle', 1.50, 3.50, 50, 100, '660e8400-e29b-41d4-a716-446655440001', false, true, true, 3.50, 5.0),
    
    -- Non-alcoholic beverages
    ('880e8400-e29b-41d4-a716-446655440004', 'COKE-001', 'Coca-Cola', 'Coca-Cola 2L bottle', '550e8400-e29b-41d4-a716-446655440002', 'bottle', 2.00, 0.00, 20, 50, '660e8400-e29b-41d4-a716-446655440002', true, false, false, 0.00, 0.0),
    ('880e8400-e29b-41d4-a716-446655440005', 'WATER-001', 'Agua Mineral', 'Mineral water 500ml bottle', '550e8400-e29b-41d4-a716-446655440002', 'bottle', 0.50, 2.00, 100, 200, '660e8400-e29b-41d4-a716-446655440002', false, false, true, 2.00, 0.0),
    ('880e8400-e29b-41d4-a716-446655440006', 'JUICE-001', 'Jugo de Naranja', 'Orange juice 1L carton', '550e8400-e29b-41d4-a716-446655440002', 'carton', 3.00, 0.00, 15, 30, '660e8400-e29b-41d4-a716-446655440002', true, true, false, 0.00, 0.0),
    
    -- Food items
    ('880e8400-e29b-41d4-a716-446655440007', 'LIME-001', 'Limones', 'Fresh limes', '550e8400-e29b-41d4-a716-446655440005', 'kg', 2.50, 0.00, 5, 20, '660e8400-e29b-41d4-a716-446655440003', true, true, false, 0.00, 0.0),
    ('880e8400-e29b-41d4-a716-446655440008', 'ICE-001', 'Hielo', 'Ice cubes', '550e8400-e29b-41d4-a716-446655440002', 'kg', 1.00, 0.00, 50, 100, '660e8400-e29b-41d4-a716-446655440003', true, false, false, 0.00, 0.0),
    
    -- Disposables
    ('880e8400-e29b-41d4-a716-446655440009', 'CUP-001', 'Vasos Plásticos', 'Plastic cups 16oz', '550e8400-e29b-41d4-a716-446655440004', 'pcs', 0.05, 0.00, 500, 1000, '660e8400-e29b-41d4-a716-446655440004', true, false, false, 0.00, 0.0),
    ('880e8400-e29b-41d4-a716-446655440010', 'NAPKIN-001', 'Servilletas', 'Paper napkins', '550e8400-e29b-41d4-a716-446655440004', 'pack', 2.00, 0.00, 20, 50, '660e8400-e29b-41d4-a716-446655440004', true, false, false, 0.00, 0.0);

-- Update inventory for Amazon storage locations
DELETE FROM inventory;
INSERT INTO inventory (item_id, location_id, quantity, batch_number, manufacture_date, expiry_date) VALUES
    -- Amazon Bebidas
    ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 48, 'RUM-2024-001', '2024-01-15', '2026-01-15'),
    ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 36, 'VODKA-2024-001', '2024-01-20', '2026-01-20'),
    ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 120, 'BEER-2024-001', '2024-02-01', '2024-08-01'),
    ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 60, 'COKE-2024-001', '2024-02-05', '2024-12-05'),
    ('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', 200, 'WATER-2024-001', '2024-02-10', '2025-02-10'),
    ('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440001', 24, 'JUICE-2024-001', '2024-02-12', '2024-03-12'),
    
    -- Amazon Comida
    ('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', 25, 'LIME-2024-001', '2024-02-15', '2024-03-01'),
    ('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440002', 100, NULL, NULL, NULL),
    
    -- Amazon Desechables
    ('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440003', 2000, NULL, NULL, NULL),
    ('880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440003', 100, NULL, NULL, NULL),
    
    -- Bar Principal
    ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', 6, 'RUM-2024-001', '2024-01-15', '2026-01-15'),
    ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 4, 'VODKA-2024-001', '2024-01-20', '2026-01-20'),
    ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', 24, 'BEER-2024-001', '2024-02-01', '2024-08-01'),
    ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 8, 'COKE-2024-001', '2024-02-05', '2024-12-05'),
    ('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440004', 3, 'LIME-2024-001', '2024-02-15', '2024-03-01'),
    ('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440004', 15, NULL, NULL, NULL),
    ('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', 200, NULL, NULL, NULL);

-- Add sales items (menu items)
INSERT INTO sales_items (id, name, description, category, price, preparation_time) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'Cuba Libre', 'Ron blanco, Coca-Cola, limón y hielo', 'bebidas', 8.50, 3),
    ('990e8400-e29b-41d4-a716-446655440002', 'Vodka Tonic', 'Vodka premium con agua tónica', 'bebidas', 9.00, 2),
    ('990e8400-e29b-41d4-a716-446655440003', 'Cerveza Nacional', 'Cerveza local fría', 'bebidas', 3.50, 1),
    ('990e8400-e29b-41d4-a716-446655440004', 'Agua Mineral', 'Agua mineral 500ml', 'bebidas', 2.00, 1),
    ('990e8400-e29b-41d4-a716-446655440005', 'Mojito', 'Ron blanco, menta, limón, azúcar y soda', 'bebidas', 10.00, 5);

-- Update recipes for cocktails
DELETE FROM recipes;
INSERT INTO recipes (id, name, sales_item_id, serving_size, description) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', 'Cuba Libre Recipe', '990e8400-e29b-41d4-a716-446655440001', 1, 'Classic Cuba Libre cocktail');

-- Insert recipe ingredients
DELETE FROM recipe_ingredients;

-- Insert sample purchase orders
DELETE FROM purchase_orders;

-- Insert purchase order items
DELETE FROM purchase_order_items;

-- Insert sample sales
DELETE FROM sales;

-- Insert sale items
DELETE FROM sale_items;

-- Insert sample maintenance schedules
DELETE FROM maintenance_schedules;

-- Insert sample reorder rules
DELETE FROM reorder_rules;
