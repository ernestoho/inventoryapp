-- Function to update inventory and create transaction log
CREATE OR REPLACE FUNCTION update_inventory(
    p_item_id UUID,
    p_location_id UUID,
    p_quantity_change INTEGER,
    p_transaction_type transaction_type,
    p_batch_number TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_current_quantity INTEGER;
    v_new_quantity INTEGER;
BEGIN
    -- Get current quantity
    SELECT COALESCE(quantity, 0) INTO v_current_quantity
    FROM inventory 
    WHERE item_id = p_item_id 
    AND location_id = p_location_id 
    AND (batch_number = p_batch_number OR (batch_number IS NULL AND p_batch_number IS NULL));
    
    v_new_quantity := v_current_quantity + p_quantity_change;
    
    -- Update or insert inventory record
    INSERT INTO inventory (item_id, location_id, quantity, batch_number)
    VALUES (p_item_id, p_location_id, v_new_quantity, p_batch_number)
    ON CONFLICT (item_id, location_id, COALESCE(batch_number, ''))
    DO UPDATE SET 
        quantity = v_new_quantity,
        updated_at = NOW();
    
    -- Create transaction log
    INSERT INTO inventory_transactions (
        item_id, location_id, transaction_type, quantity_change,
        quantity_before, quantity_after, batch_number,
        reference_id, reference_type, notes, created_by
    ) VALUES (
        p_item_id, p_location_id, p_transaction_type, p_quantity_change,
        v_current_quantity, v_new_quantity, p_batch_number,
        p_reference_id, p_reference_type, p_notes, auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get low stock items
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
    item_id UUID,
    item_name TEXT,
    sku TEXT,
    location_id UUID,
    location_name TEXT,
    current_stock INTEGER,
    reorder_point INTEGER,
    preferred_supplier_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.name,
        i.sku,
        l.id,
        l.name,
        COALESCE(inv.quantity, 0),
        i.reorder_point,
        s.name
    FROM items i
    CROSS JOIN locations l
    LEFT JOIN inventory inv ON i.id = inv.item_id AND l.id = inv.location_id
    LEFT JOIN suppliers s ON i.preferred_supplier_id = s.id
    WHERE i.is_active = true 
    AND l.is_active = true
    AND COALESCE(inv.quantity, 0) <= i.reorder_point
    AND i.reorder_point > 0
    ORDER BY i.name, l.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate inventory value
CREATE OR REPLACE FUNCTION get_inventory_value()
RETURNS TABLE (
    location_id UUID,
    location_name TEXT,
    total_value DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.name,
        COALESCE(SUM(inv.quantity * i.cost_price), 0)::DECIMAL(12,2)
    FROM locations l
    LEFT JOIN inventory inv ON l.id = inv.location_id
    LEFT JOIN items i ON inv.item_id = i.id
    WHERE l.is_active = true
    GROUP BY l.id, l.name
    ORDER BY l.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get items expiring soon
CREATE OR REPLACE FUNCTION get_expiring_items(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
    item_id UUID,
    item_name TEXT,
    sku TEXT,
    location_id UUID,
    location_name TEXT,
    batch_number TEXT,
    quantity INTEGER,
    expiry_date DATE,
    days_to_expiry INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.name,
        i.sku,
        l.id,
        l.name,
        inv.batch_number,
        inv.quantity,
        inv.expiry_date,
        (inv.expiry_date - CURRENT_DATE)::INTEGER
    FROM inventory inv
    JOIN items i ON inv.item_id = i.id
    JOIN locations l ON inv.location_id = l.id
    WHERE inv.expiry_date IS NOT NULL
    AND inv.expiry_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND inv.quantity > 0
    ORDER BY inv.expiry_date, i.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_orders_updated_at BEFORE UPDATE ON production_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON maintenance_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reorder_rules_updated_at BEFORE UPDATE ON reorder_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
