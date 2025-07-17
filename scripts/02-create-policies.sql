-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories policies
CREATE POLICY "Everyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Managers and admins can manage categories" ON categories FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);

-- Suppliers policies
CREATE POLICY "Everyone can view suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Managers and admins can manage suppliers" ON suppliers FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);

-- Locations policies
CREATE POLICY "Everyone can view locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Managers and admins can manage locations" ON locations FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);

-- Items policies
CREATE POLICY "Everyone can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage items" ON items FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Inventory policies
CREATE POLICY "Everyone can view inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage inventory" ON inventory FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Purchase orders policies
CREATE POLICY "Everyone can view purchase orders" ON purchase_orders FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage purchase orders" ON purchase_orders FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Purchase order items policies
CREATE POLICY "Everyone can view purchase order items" ON purchase_order_items FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage purchase order items" ON purchase_order_items FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Sales policies
CREATE POLICY "Everyone can view sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage sales" ON sales FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Sale items policies
CREATE POLICY "Everyone can view sale items" ON sale_items FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage sale items" ON sale_items FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Recipes policies
CREATE POLICY "Everyone can view recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Managers and above can manage recipes" ON recipes FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);

-- Recipe ingredients policies
CREATE POLICY "Everyone can view recipe ingredients" ON recipe_ingredients FOR SELECT USING (true);
CREATE POLICY "Managers and above can manage recipe ingredients" ON recipe_ingredients FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);

-- Production orders policies
CREATE POLICY "Everyone can view production orders" ON production_orders FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage production orders" ON production_orders FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Inventory transactions policies (audit log)
CREATE POLICY "Everyone can view inventory transactions" ON inventory_transactions FOR SELECT USING (true);
CREATE POLICY "System can insert inventory transactions" ON inventory_transactions FOR INSERT USING (true);

-- Maintenance schedules policies
CREATE POLICY "Everyone can view maintenance schedules" ON maintenance_schedules FOR SELECT USING (true);
CREATE POLICY "Operators and above can manage maintenance schedules" ON maintenance_schedules FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager', 'operator')
);

-- Reorder rules policies
CREATE POLICY "Everyone can view reorder rules" ON reorder_rules FOR SELECT USING (true);
CREATE POLICY "Managers and above can manage reorder rules" ON reorder_rules FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'manager')
);
