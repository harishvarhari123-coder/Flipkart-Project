-- =============================================
-- FLIPKART E-COMMERCE DATABASE
-- Run this in XAMPP phpMyAdmin SQL tab
-- =============================================

CREATE DATABASE IF NOT EXISTS flipkart_db;
USE flipkart_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL,
  discount INT DEFAULT 0,
  image VARCHAR(500) DEFAULT NULL,
  category_id INT,
  brand VARCHAR(100) DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  stock INT DEFAULT 100,
  specifications JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Cart table (stored in DB as requested)
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  locality VARCHAR(100) DEFAULT NULL,
  address_line TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  landmark VARCHAR(200) DEFAULT NULL,
  address_type ENUM('Home', 'Work') DEFAULT 'Home',
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  delivery_charge DECIMAL(10,2) DEFAULT 0.00,
  final_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Ordered', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Ordered',
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,
  out_for_delivery_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  estimated_delivery DATE DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery') NOT NULL,
  status ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
  transaction_id VARCHAR(100) DEFAULT NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0.00,
  delivery_charge DECIMAL(10,2) DEFAULT 0.00,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- =============================================
-- SEED DATA: Categories
-- =============================================
INSERT INTO categories (name, icon) VALUES
('Mobiles', '📱'),
('Fashion', '👕'),
('Electronics', '💻'),
('Home', '🏠'),
('Appliances', '🔌'),
('Beauty', '💄'),
('Toys', '🧸'),
('Sports', '⚽'),
('Books', '📚'),
('Furniture', '🪑');

-- =============================================
-- SEED DATA: Products
-- =============================================
    INSERT INTO products (name, description, price, original_price, discount, image, category_id, brand, rating, rating_count, stock, specifications) VALUES
    ('Samsung Galaxy S24 Ultra', '6.8" QHD+ Dynamic AMOLED 2X, 200MP Camera, Snapdragon 8 Gen 3, 12GB RAM, 256GB Storage, 5000mAh Battery', 109999.00, 134999.00, 19, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 1, 'Samsung', 4.5, 12453, 50, '{"RAM": "12GB", "Storage": "256GB", "Battery": "5000mAh", "Display": "6.8 inch"}'),

    ('iPhone 15 Pro Max', '6.7" Super Retina XDR, A17 Pro Chip, 48MP Camera System, Titanium Design, USB-C, 256GB', 159900.00, 179900.00, 11, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 1, 'Apple', 4.7, 8932, 30, '{"RAM": "8GB", "Storage": "256GB", "Battery": "4422mAh", "Display": "6.7 inch"}'),

  ('OnePlus 12', '6.82" 2K LTPO AMOLED, Snapdragon 8 Gen 3, 50MP Hasselblad Camera, 100W SUPERVOOC, 5400mAh', 64999.00, 69999.00, 7, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400', 1, 'OnePlus', 4.4, 5621, 75, '{"RAM": "12GB", "Storage": "256GB", "Battery": "5400mAh", "Display": "6.82 inch"}'),

('Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation, 30-hour battery, crystal clear hands-free calling, multipoint connection', 24990.00, 34990.00, 29, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', 3, 'Sony', 4.6, 7845, 100, '{"Type": "Over-Ear", "Battery": "30 Hours", "Noise Cancellation": "Yes", "Bluetooth": "5.3"}'),

('MacBook Air M3', '13.6" Liquid Retina, Apple M3 Chip, 8GB RAM, 256GB SSD, 18-hour battery, MagSafe charging', 114900.00, 129900.00, 12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 3, 'Apple', 4.8, 3456, 25, '{"Processor": "Apple M3", "RAM": "8GB", "Storage": "256GB SSD", "Display": "13.6 inch"}'),

('Nike Air Max 270', 'Men''s Running Shoes, Breathable Mesh Upper, Max Air Unit, Foam Midsole, Rubber Outsole', 12995.00, 15995.00, 19, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 2, 'Nike', 4.3, 9876, 200, '{"Type": "Running", "Material": "Mesh", "Sole": "Rubber", "Closure": "Lace-Up"}'),

('Levi''s 511 Slim Fit Jeans', 'Men''s Slim Fit Jeans, Stretch Denim, Classic 5-Pocket Styling, Machine Washable', 2799.00, 4599.00, 39, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 2, 'Levi''s', 4.2, 15432, 300, '{"Fit": "Slim", "Material": "Stretch Denim", "Rise": "Mid", "Closure": "Zip"}'),

('Samsung 55" Crystal 4K TV', '55 inch Crystal 4K UHD Smart TV, Crystal Processor 4K, HDR, Smart Hub, Built-in Alexa', 42990.00, 64900.00, 34, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 3, 'Samsung', 4.4, 6543, 40, '{"Screen Size": "55 inch", "Resolution": "4K UHD", "Smart TV": "Yes", "HDR": "Yes"}'),

('Dyson V15 Detect Vacuum', 'Laser Detect Technology, 60 Min Runtime, LCD Display, Advanced Filtration, HEPA Filter', 52900.00, 62900.00, 16, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', 5, 'Dyson', 4.5, 2341, 35, '{"Type": "Cordless Stick", "Runtime": "60 min", "Filter": "HEPA", "Power": "230W"}'),

('IKEA KALLAX Shelf Unit', 'Bookcase Shelf Unit, 4x2 cubes, White, 147x77 cm, Particle Board, Wall Anchoring Required', 7990.00, 9990.00, 20, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400', 10, 'IKEA', 4.1, 4532, 60, '{"Material": "Particle Board", "Dimensions": "147x77 cm", "Color": "White", "Shelves": "8"}'),

('boAt Rockerz 450 Headphones', '40mm Drivers, 15H Playback, Padded Ear Cushions, Dual Connectivity, Foldable Design', 1299.00, 3990.00, 67, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 3, 'boAt', 4.1, 23456, 500, '{"Type": "On-Ear", "Battery": "15 Hours", "Driver": "40mm", "Bluetooth": "5.0"}'),

('The Alchemist by Paulo Coelho', 'International Bestseller, Paperback, 197 Pages, A magical fable about following your dream', 299.00, 399.00, 25, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 9, 'HarperOne', 4.6, 45678, 1000, '{"Author": "Paulo Coelho", "Pages": "197", "Format": "Paperback", "Language": "English"}'),

('Puma Men''s T-Shirt', 'Essential Logo T-Shirt, Cotton, Regular Fit, Crew Neck, Short Sleeves', 899.00, 1799.00, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 2, 'Puma', 4.0, 8765, 400, '{"Material": "Cotton", "Fit": "Regular", "Neck": "Crew", "Sleeve": "Short"}'),

('LG 8kg Front Load Washing Machine', '8 Kg, Inverter Direct Drive, Steam Wash, 6 Motion DD, Smart Diagnosis, ThinQ (Wi-Fi)', 36990.00, 47990.00, 23, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400', 5, 'LG', 4.3, 3456, 30, '{"Capacity": "8 Kg", "Type": "Front Load", "Inverter": "Yes", "Smart": "Wi-Fi"}'),

('Yoga Mat Premium', '6mm Thick, Non-Slip Surface, Eco-Friendly TPE Material, Carry Strap Included, 183x61cm', 1299.00, 2499.00, 48, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 8, 'Boldfit', 4.2, 6789, 250, '{"Thickness": "6mm", "Material": "TPE", "Size": "183x61cm", "Non-Slip": "Yes"}'),

('Maybelline Fit Me Foundation', 'Matte + Poreless, Normal to Oily Skin, SPF 22, Shade 128 Warm Nude, 30ml', 499.00, 599.00, 17, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 6, 'Maybelline', 4.1, 12345, 350, '{"Volume": "30ml", "SPF": "22", "Skin Type": "Normal to Oily", "Finish": "Matte"}'),

('LEGO City Police Station', '668 Pieces, Ages 6+, Includes 5 Minifigures, Police Dog, Buildable Toy Set', 4999.00, 6999.00, 29, 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400', 7, 'LEGO', 4.7, 2345, 45, '{"Pieces": "668", "Age": "6+", "Minifigures": "5", "Theme": "City"}'),

('Realme Narzo 70x 5G', '6.72" FHD+ Display, Dimensity 6100+, 50MP AI Camera, 5000mAh, 33W Fast Charging, 6GB+128GB', 11999.00, 14999.00, 20, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 1, 'Realme', 4.2, 7654, 150, '{"RAM": "6GB", "Storage": "128GB", "Battery": "5000mAh", "Display": "6.72 inch"}'),

('Canon EOS R50 Camera', 'Mirrorless Camera, 24.2MP APS-C CMOS, 4K Video, RF-S 18-45mm Lens Kit, Wi-Fi, Bluetooth', 74990.00, 84990.00, 12, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', 3, 'Canon', 4.5, 1234, 20, '{"Sensor": "24.2MP APS-C", "Video": "4K", "Lens": "RF-S 18-45mm", "Type": "Mirrorless"}'),

('Wooden Dining Table Set', '6 Seater Dining Table with Chairs, Sheesham Wood, Natural Finish, Modern Design', 29999.00, 45999.00, 35, 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400', 10, 'HomeTown', 4.0, 876, 15, '{"Material": "Sheesham Wood", "Seating": "6", "Finish": "Natural", "Style": "Modern"}');






-- ─────────────────────────────────────────────────
--  Harikart — Profile Schema (with avatar image)
-- ─────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS harikart;
USE harikart;

-- Users table — avatar stored as MEDIUMBLOB + mime type
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name            VARCHAR(100)    NOT NULL,
  email           VARCHAR(150)    NOT NULL UNIQUE,
  phone           VARCHAR(20)     DEFAULT NULL,
  password_hash   VARCHAR(255)    NOT NULL,
  avatar_data     MEDIUMBLOB      DEFAULT NULL,   -- raw image bytes (max ~16MB)
  avatar_mime     VARCHAR(50)     DEFAULT NULL,   -- e.g. image/jpeg, image/png
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED    NOT NULL,
  label       VARCHAR(50)     NOT NULL DEFAULT 'Home',
  full_name   VARCHAR(100)    NOT NULL,
  phone       VARCHAR(20)     NOT NULL,
  line1       VARCHAR(200)    NOT NULL,
  line2       VARCHAR(200)    DEFAULT NULL,
  city        VARCHAR(100)    NOT NULL,
  state       VARCHAR(100)    NOT NULL,
  pincode     VARCHAR(10)     NOT NULL,
  is_default  TINYINT(1)      NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;