const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

const REFUND_FILE = path.join(__dirname, 'refund_history.json');

const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_wishlist_item (user_id, product_id)
      )
    `);
    console.log('✅ Wishlist table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS contact (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(150)  NOT NULL,
        email        VARCHAR(255)  NOT NULL,
        message      TEXT          NOT NULL,
        created_time DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Contact table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_follow (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Follows table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS follow_notifications (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        to_user_id   INT NOT NULL,
        from_user_id INT,
        from_name    VARCHAR(150) NOT NULL DEFAULT 'Someone',
        from_email   VARCHAR(255),
        type         ENUM('like','comment','reply') NOT NULL DEFAULT 'like',
        message      TEXT,
        is_read      TINYINT NOT NULL DEFAULT 0,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Follow notifications table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS blocked_users (
        blocker_id INT NOT NULL,
        blocked_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (blocker_id, blocked_id),
        FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Blocked users table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS store_profile (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(150) NOT NULL DEFAULT 'Harikart',
        handle     VARCHAR(100) NOT NULL DEFAULT '@harikart.official',
        bio        TEXT,
        avatar     LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Store profile table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        code         VARCHAR(30)  UNIQUE NOT NULL,
        title        VARCHAR(100),
        description  TEXT,
        type         ENUM('percent','flat','shipping','cashback') NOT NULL,
        discount     DECIMAL(10,2) NOT NULL DEFAULT 0,
        min_order    DECIMAL(10,2) NOT NULL DEFAULT 0,
        max_discount DECIMAL(10,2) DEFAULT NULL,
        expiry       DATETIME,
        uses_left    INT DEFAULT 100,
        active       TINYINT DEFAULT 1,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Coupons table initialized');

    const [existingCoupons] = await db.query('SELECT COUNT(*) as count FROM coupons');
    if (existingCoupons[0].count === 0) {
      await db.query(`
        INSERT INTO coupons (code, title, description, type, discount, min_order, max_discount, expiry, uses_left, active) VALUES
        ('HARI10',        '10% Off on All Orders',       'Get flat 10% off on your entire cart. No minimum order required.',      'percent',  10,  0,    500,  '2026-12-31 23:59:59', 48,  1),
        ('FREESHIP99',    'Free Shipping',                'Enjoy free delivery on orders above ₹499. Valid on all products.',      'shipping',  0,  499,  NULL, '2026-12-31 23:59:59', 200, 1),
        ('WELCOME200',    '₹200 Off on First Order',     'Exclusive welcome offer for new users. Minimum cart value ₹999.',       'flat',     200, 999,  200,  '2026-12-31 23:59:59', 15,  1),
        ('ELECTRONICS15', '15% Off on Electronics',      'Save big on all electronics. Min. order ₹1499. Max discount ₹1500.',   'percent',  15,  1499, 1500, '2026-12-31 23:59:59', 7,   1),
        ('FASHION25',     '25% Off on Fashion',          'Massive discount on all fashion & apparel. Min order ₹799.',           'percent',  25,  799,  800,  '2026-12-31 23:59:59', 63,  1),
        ('GIFTYOU50',     '₹50 Cashback Gift',           'Flat ₹50 cashback on orders above ₹299. Credited within 24 hrs.',      'cashback', 50,  299,  50,   '2026-12-31 23:59:59', 3,   1)
      `);
      console.log('✅ Default coupons seeded');
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Reviews table initialized');

    // Update Fashion to Men's Fashion
    await db.query(`UPDATE categories SET name = 'Men\\'s Fashion', icon = '👕' WHERE name = 'Fashion' OR name = 'Men\\'s Fashion'`);
    
    // Insert Women's Fashion if not exists
    const [womenCat] = await db.query(`SELECT id FROM categories WHERE name = 'Women\\'s Fashion'`);
    if (womenCat.length === 0) {
      const [insertRes] = await db.query(`INSERT INTO categories (name, icon) VALUES ('Women\\'s Fashion', '👗')`);
      const newCatId = insertRes.insertId;
      
      // Seed some Women's products
      await db.query(`
        INSERT INTO products (name, description, price, original_price, discount, image, category_id, brand, rating, rating_count, stock, specifications) VALUES
        ('Women Floral Print Dress', 'A beautiful floral summer dress for women, lightweight and breathable.', 1299.00, 1999.00, 35, 'https://images.unsplash.com/photo-1572804013309-82a89b4f0b3e?w=400', ?, 'Zara', 4.5, 342, 50, '{"Material": "Cotton", "Fit": "Regular"}'),
        ('Women Leather Handbag', 'Premium quality leather handbag, spacious and stylish for everyday use.', 2499.00, 3999.00, 37, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400', ?, 'Baggit', 4.8, 560, 30, '{"Material": "Leather", "Type": "Handbag"}'),
        ('Women High Heels', 'Elegant high heels perfect for parties and formal events.', 1599.00, 2499.00, 36, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', ?, 'Bata', 4.2, 120, 25, '{"Type": "Heels", "Material": "Synthetic"}')
      `, [newCatId, newCatId, newCatId]);
      console.log("✅ Women's Fashion category and products added");
    }

    await db.query(`
      ALTER TABLE payments MODIFY COLUMN status ENUM('Pending', 'Success', 'Failed', 'Refunded') DEFAULT 'Pending'
    `).catch(err => {
      console.log('payments table modify status notice (probably already updated):', err.message);
    });

  } catch (err) {
    console.error('❌ Error initializing tables:', err);
  }
};
initDb();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'flipkart_jwt_secret_key_2024';

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://flipkart-project-bclg.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/init-db', async (req, res) => {
  try {
    const sqlFilePath = path.join(__dirname, '..', 'database_queries.sql');
    const sqlQueries = await fs.readFile(sqlFilePath, 'utf8');
    
    // Split by semicolons and remove the CREATE DATABASE statements if they exist
    // as Aiven might not allow arbitrary database creation, we just use the default one.
    let sanitizedSql = sqlQueries.replace(/CREATE DATABASE IF NOT EXISTS \w+;/g, '');
    sanitizedSql = sanitizedSql.replace(/USE \w+;/g, '');

    await db.query(sanitizedSql);
    res.send("<h1>Database successfully initialized! All tables created.</h1><p>You can now close this tab.</p>");
  } catch (err) {
    console.error("Init DB Error:", err);
    res.status(500).send("<h1>Error initializing database</h1><p>" + err.message + "</p>");
  }
});

// ── Auth middleware ──────────────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const otpStore = new Map();

// ── Auth routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    // Removed nodemailer test account creation because it crashes on Render
    console.log("\n=========================================");
    console.log(`🔑 YOUR REGISTRATION OTP IS: ${otp}`);
    console.log("=========================================\n");
    res.json({ message: 'OTP sent successfully', otp });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null]
    );
    otpStore.delete(email);
    const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name, email, phone }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ message: 'Invalid email or password' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, phone, created_at FROM users WHERE id = ?', [req.userId]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Categories & Products ────────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, min_price, max_price } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (category) {
      const categoryIds = category.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (categoryIds.length > 0) {
        query += ` AND p.category_id IN (${categoryIds.map(() => '?').join(',')})`;
        params.push(...categoryIds);
      }
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (min_price) { query += ' AND p.price >= ?'; params.push(min_price); }
    if (max_price) { query += ' AND p.price <= ?'; params.push(max_price); }

    switch (sort) {
      case 'price_low':  query += ' ORDER BY p.price ASC';      break;
      case 'price_high': query += ' ORDER BY p.price DESC';     break;
      case 'rating':     query += ' ORDER BY p.rating DESC';    break;
      case 'discount':   query += ' ORDER BY p.discount DESC';  break;
      default:           query += ' ORDER BY p.created_at DESC';
    }

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Reviews ──────────────────────────────────────────────────────────────────
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT r.id, r.rating, r.review_text, r.created_at, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json(reviews);
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products/:id/reviews', authenticate, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const productId = req.params.id;
    const { rating, review_text } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      await connection.rollback();
      return res.status(400).json({ message: 'Valid rating between 1 and 5 is required' });
    }

    // Insert review
    await connection.query(
      'INSERT INTO reviews (user_id, product_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [req.userId, productId, rating, review_text]
    );

    // Update product rating
    const [products] = await connection.query(
      'SELECT rating, rating_count FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );

    if (products.length > 0) {
      const product = products[0];
      const currentRating = parseFloat(product.rating) || 0;
      const currentCount = parseInt(product.rating_count) || 0;

      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + rating) / newCount;

      await connection.query(
        'UPDATE products SET rating = ?, rating_count = ? WHERE id = ?',
        [newRating.toFixed(1), newCount, productId]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Add review error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// ── Cart ─────────────────────────────────────────────────────────────────────
app.get('/api/cart/count', authenticate, async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE user_id = ?',
      [req.userId]
    );
    res.json({ count: result[0].count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.original_price,
              p.discount, p.image, p.brand, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.userId]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart', authenticate, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const [products] = await db.query('SELECT id, stock FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });

    const [existing] = await db.query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [req.userId, product_id]
    );
    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      if (newQty > products[0].stock) return res.status(400).json({ message: 'Not enough stock available' });
      await db.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
      res.json({ message: 'Cart updated', cart_id: existing[0].id });
    } else {
      if (quantity > products[0].stock) return res.status(400).json({ message: 'Not enough stock available' });
      const [result] = await db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.userId, product_id, quantity]
      );
      res.status(201).json({ message: 'Added to cart', cart_id: result.insertId });
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/cart/:id', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
    const [cartItem] = await db.query(
      'SELECT c.*, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?',
      [req.params.id, req.userId]
    );
    if (cartItem.length === 0) return res.status(404).json({ message: 'Cart item not found' });
    if (quantity > cartItem[0].stock) return res.status(400).json({ message: 'Not enough stock available' });
    await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.userId]);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart/:id', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Addresses ────────────────────────────────────────────────────────────────
app.get('/api/addresses', authenticate, async (req, res) => {
  try {
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.userId]
    );
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/addresses', authenticate, async (req, res) => {
  try {
    const { name, phone, pincode, locality, address_line, city, state, landmark, address_type, is_default } = req.body;
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.userId]);
    }
    const [result] = await db.query(
      `INSERT INTO addresses (user_id, name, phone, pincode, locality, address_line, city, state, landmark, address_type, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, name, phone, pincode, locality || null, address_line, city, state, landmark || null, address_type || 'Home', is_default ? 1 : 0]
    );
    res.status(201).json({ message: 'Address added', id: result.insertId });
  } catch (err) {
    console.error('Address error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Coupons ──────────────────────────────────────────────────────────────────
app.get('/api/coupons', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, code, title, description, type, discount, min_order, max_discount, expiry, uses_left
       FROM coupons
       WHERE active = 1 AND (expiry IS NULL OR expiry > NOW())
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Coupons fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/coupons/validate', authenticate, async (req, res) => {
  try {
    const { code, total } = req.body;

    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const [rows] = await db.query(
      `SELECT * FROM coupons
       WHERE code = ? AND active = 1 AND (expiry IS NULL OR expiry > NOW())`,
      [code.trim().toUpperCase()]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Invalid or expired coupon code' });

    const coupon = rows[0];

    if (total < coupon.min_order)
      return res.status(400).json({
        error: `Minimum order of ₹${coupon.min_order} required for this coupon`
      });

    if (coupon.uses_left !== null && coupon.uses_left <= 0)
      return res.status(400).json({ error: 'This coupon has no uses left' });

    res.json({
      id:           coupon.id,
      code:         coupon.code,
      title:        coupon.title,
      type:         coupon.type,
      discount:     coupon.discount,
      min_order:    coupon.min_order,
      max_discount: coupon.max_discount,
    });
  } catch (err) {
    console.error('Coupon validate error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Orders ───────────────────────────────────────────────────────────────────
app.post('/api/orders', authenticate, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { address_id, payment_method, items, buy_now, final_amount: frontendFinalAmount, coupon } = req.body;

    // ── Validate address ────────────────────────────────────────────────────
    const [addresses] = await connection.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?', [address_id, req.userId]
    );
    if (addresses.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid address' });
    }

    // ── Resolve order items ─────────────────────────────────────────────────
    let orderItems = [];
    if (buy_now && items) {
      for (const item of items) {
        const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
        if (products.length === 0 || products[0].stock < item.quantity) {
          await connection.rollback();
          return res.status(400).json({ message: `Product ${item.product_id} not available` });
        }
        orderItems.push({
          product_id:    products[0].id,
          product_name:  products[0].name,
          product_image: products[0].image,
          price:         products[0].price,
          quantity:      item.quantity,
          stock:         products[0].stock,
        });
      }
    } else {
      const [cartItems] = await connection.query(
        `SELECT c.*, p.name, p.price, p.image, p.stock
         FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`,
        [req.userId]
      );
      if (cartItems.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: 'Cart is empty' });
      }
      for (const item of cartItems) {
        if (item.stock < item.quantity) {
          await connection.rollback();
          return res.status(400).json({ message: `${item.name} is out of stock` });
        }
        orderItems.push({
          product_id:    item.product_id,
          product_name:  item.name,
          product_image: item.image,
          price:         item.price,
          quantity:      item.quantity,
          stock:         item.stock,
        });
      }
    }

    // ── Calculate amounts ───────────────────────────────────────────────────
    const totalAmount    = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = totalAmount >= 500 ? 0 : 40;

    // ── KEY FIX: use coupon-applied finalAmount sent from Payment.jsx ───────
    const parsedFrontendFinal = frontendFinalAmount != null ? parseFloat(frontendFinalAmount) : null;
    const rawTotal            = totalAmount + deliveryCharge;

    const discountAmount = parsedFrontendFinal !== null
      ? Math.max(0, Math.round((rawTotal - parsedFrontendFinal) * 100) / 100)
      : 0;

    const finalAmount = parsedFrontendFinal !== null
      ? parsedFrontendFinal
      : rawTotal;

    // ── Estimated delivery ──────────────────────────────────────────────────
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5);

    // ── Insert order ────────────────────────────────────────────────────────
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, address_id, total_amount, discount_amount, delivery_charge, final_amount, status, estimated_delivery)
       VALUES (?, ?, ?, ?, ?, ?, 'Ordered', ?)`,
      [req.userId, address_id, totalAmount, discountAmount, deliveryCharge, finalAmount, estimatedDelivery]
    );
    const orderId = orderResult.insertId;

    // ── Insert order items & deduct stock ───────────────────────────────────
    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_name, item.product_image, item.price, item.quantity]
      );
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // ── Payment record ──────────────────────────────────────────────────────
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
    const paymentStatus = payment_method === 'Cash on Delivery' ? 'Pending' : 'Success';
    const paidAt        = paymentStatus === 'Success' ? new Date() : null;

    await connection.query(
      `INSERT INTO payments (order_id, user_id, amount, method, status, transaction_id, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, req.userId, finalAmount, payment_method, paymentStatus, transactionId, paidAt]
    );

    // ── Invoice record ──────────────────────────────────────────────────────
    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + String(orderId).padStart(6, '0');
    const tax           = parseFloat((totalAmount * 0.18).toFixed(2));

    await connection.query(
      `INSERT INTO invoices (order_id, invoice_number, user_id, subtotal, tax, delivery_charge, discount, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, invoiceNumber, req.userId, totalAmount, tax, deliveryCharge, discountAmount, finalAmount]
    );

    // ── Decrement coupon uses_left if a coupon was applied ──────────────────
    if (coupon) {
      await connection.query(
        `UPDATE coupons SET uses_left = GREATEST(0, uses_left - 1)
         WHERE code = ? AND uses_left > 0`,
        [coupon.toUpperCase()]
      );
    }

    // ── Clear cart for normal checkout ──────────────────────────────────────
    if (!buy_now) {
      await connection.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);
    }

    await connection.commit();

    res.status(201).json({
      message:            'Order placed successfully',
      order_id:           orderId,
      transaction_id:     transactionId,
      invoice_number:     invoiceNumber,
      estimated_delivery: estimatedDelivery,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Order error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// ── Order status auto-update helper ─────────────────────────────────────────
const checkAndUpdateOrderStatus = async (order) => {
  if (order.status === 'Cancelled' || order.status === 'Delivered') {
    return order;
  }

  const orderedTime = new Date(order.ordered_at).getTime();
  const now         = Date.now();
  const elapsedMs   = now - orderedTime;

  const oneHour   = 60 * 60 * 1000;
  const fourHours = 4 * 60 * 60 * 1000;

  let newStatus        = 'Ordered';
  let confirmedAt      = order.confirmed_at;
  let shippedAt        = order.shipped_at;
  let outForDeliveryAt = order.out_for_delivery_at;
  let deliveredAt      = order.delivered_at;

  if (elapsedMs >= oneHour + 3 * fourHours) {
    newStatus = 'Delivered';
    if (!confirmedAt)      confirmedAt      = new Date(orderedTime + oneHour);
    if (!shippedAt)        shippedAt        = new Date(orderedTime + oneHour + fourHours);
    if (!outForDeliveryAt) outForDeliveryAt = new Date(orderedTime + oneHour + 2 * fourHours);
    if (!deliveredAt)      deliveredAt      = new Date(orderedTime + oneHour + 3 * fourHours);
  } else if (elapsedMs >= oneHour + 2 * fourHours) {
    newStatus = 'Out for Delivery';
    if (!confirmedAt)      confirmedAt      = new Date(orderedTime + oneHour);
    if (!shippedAt)        shippedAt        = new Date(orderedTime + oneHour + fourHours);
    if (!outForDeliveryAt) outForDeliveryAt = new Date(orderedTime + oneHour + 2 * fourHours);
  } else if (elapsedMs >= oneHour + fourHours) {
    newStatus = 'Shipped';
    if (!confirmedAt) confirmedAt = new Date(orderedTime + oneHour);
    if (!shippedAt)   shippedAt   = new Date(orderedTime + oneHour + fourHours);
  } else if (elapsedMs >= oneHour) {
    newStatus = 'Confirmed';
    if (!confirmedAt) confirmedAt = new Date(orderedTime + oneHour);
  }

  if (newStatus !== order.status) {
    await db.query(
      `UPDATE orders SET
         status              = ?,
         confirmed_at        = COALESCE(confirmed_at, ?),
         shipped_at          = COALESCE(shipped_at, ?),
         out_for_delivery_at = COALESCE(out_for_delivery_at, ?),
         delivered_at        = COALESCE(delivered_at, ?)
       WHERE id = ?`,
      [newStatus, confirmedAt, shippedAt, outForDeliveryAt, deliveredAt, order.id]
    );
    order.status             = newStatus;
    order.confirmed_at       = confirmedAt;
    order.shipped_at         = shippedAt;
    order.out_for_delivery_at = outForDeliveryAt;
    order.delivered_at       = deliveredAt;
  }

  return order;
};

const appendRefundToFile = async (refund) => {
  try {
    let history = [];
    try {
      const data = await fs.readFile(REFUND_FILE, 'utf8');
      history = JSON.parse(data);
    } catch (err) {
      history = [];
    }
    history.push(refund);
    await fs.writeFile(REFUND_FILE, JSON.stringify(history, null, 2), 'utf8');
    console.log('✅ Refund history appended to file:', refund.refund_id);
  } catch (err) {
    console.error('❌ Error writing refund history file:', err);
  }
};

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*,
         (SELECT COUNT(*)         FROM order_items oi WHERE oi.order_id = o.id) as item_count,
         (SELECT oi.product_image FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as first_image,
         (SELECT oi.product_name  FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as first_product
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.ordered_at DESC`,
      [req.userId]
    );

    const updatedOrders = [];
    for (const order of orders) {
      const updated = await checkAndUpdateOrderStatus(order);
      updatedOrders.push(updated);
    }
    res.json(updatedOrders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/:id', authenticate, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*,
         a.name         as address_name,
         a.phone        as address_phone,
         a.address_line,
         a.city,
         a.state,
         a.pincode,
         a.locality
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, req.userId]
    );
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order   = await checkAndUpdateOrderStatus(orders[0]);
    const [items]   = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    const [payment] = await db.query('SELECT * FROM payments WHERE order_id = ?', [req.params.id]);

    res.json({ ...order, items, payment: payment[0] || null });
  } catch (err) {
    console.error('Get order detail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/orders/:id/cancel', authenticate, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      'SELECT status, ordered_at FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    const order        = orders[0];
    const orderedTime  = new Date(order.ordered_at).getTime();
    const elapsed      = Date.now() - orderedTime;
    const cancelWindow = 60 * 60 * 1000;

    if (elapsed >= cancelWindow) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cancellation window has expired' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)) {
      await connection.rollback();
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    const [items] = await connection.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?', [req.params.id]
    );
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]
      );
    }

    await connection.query('UPDATE orders SET status = "Cancelled" WHERE id = ?', [req.params.id]);

    const [payments] = await connection.query('SELECT * FROM payments WHERE order_id = ?', [req.params.id]);
    const payment    = payments[0];
    let isRefunded   = false;
    let refundDetails = null;

    if (payment && payment.status === 'Success') {
      const refundTxnId = 'REF' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

      await connection.query(
        'UPDATE payments SET status = "Refunded", transaction_id = ?, paid_at = ? WHERE order_id = ?',
        [refundTxnId, new Date(), req.params.id]
      );
      isRefunded = true;

      refundDetails = {
        refund_id:               'RID' + Date.now() + Math.floor(Math.random() * 1000),
        order_id:                parseInt(req.params.id),
        user_id:                 req.userId,
        amount:                  parseFloat(payment.amount),
        payment_method:          payment.method,
        original_transaction_id: payment.transaction_id,
        refund_transaction_id:   refundTxnId,
        refunded_at:             new Date().toISOString(),
        status:                  'Completed',
      };

      await appendRefundToFile(refundDetails);
    } else {
      await connection.query('UPDATE payments SET status = "Failed" WHERE order_id = ?', [req.params.id]);
    }

    await connection.commit();
    res.json({
      message:       'Order cancelled successfully' + (isRefunded ? ' and refund processed automatically!' : '!'),
      refunded:      isRefunded,
      refundDetails,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Cancel order error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

app.delete('/api/orders/:id', authenticate, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);
    await connection.query('DELETE FROM payments   WHERE order_id = ?', [req.params.id]);
    await connection.query('DELETE FROM invoices   WHERE order_id = ?', [req.params.id]);

    const [result] = await connection.query(
      'DELETE FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found or not authorized to delete' });
    }

    await connection.commit();
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  } finally {
    connection.release();
  }
});

app.get('/api/refund-history', authenticate, async (req, res) => {
  try {
    const data        = await fs.readFile(REFUND_FILE, 'utf8').catch(() => '[]');
    const history     = JSON.parse(data);
    const userRefunds = history.filter(r => r.user_id === req.userId);
    res.json(userRefunds);
  } catch (err) {
    console.error('Fetch refund history error:', err);
    res.status(500).json({ message: 'Server error reading refund history' });
  }
});

// ── Payments & Invoices ──────────────────────────────────────────────────────
app.get('/api/payments/:orderId', authenticate, async (req, res) => {
  try {
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE order_id = ? AND user_id = ?',
      [req.params.orderId, req.userId]
    );
    if (payments.length === 0) return res.status(404).json({ message: 'Payment not found' });
    res.json(payments[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/invoices/:orderId', authenticate, async (req, res) => {
  try {
    const [invoices] = await db.query(
      'SELECT * FROM invoices WHERE order_id = ? AND user_id = ?',
      [req.params.orderId, req.userId]
    );
    if (invoices.length === 0) return res.status(404).json({ message: 'Invoice not found' });
    const [items]  = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.orderId]);
    const [orders] = await db.query(
      'SELECT o.*, a.name as address_name, a.phone as address_phone, a.address_line, a.city, a.state, a.pincode FROM orders o LEFT JOIN addresses a ON o.address_id = a.id WHERE o.id = ?',
      [req.params.orderId]
    );
    const [user] = await db.query('SELECT name, email, phone FROM users WHERE id = ?', [req.userId]);
    res.json({ invoice: invoices[0], items, order: orders[0] || null, user: user[0] || null });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Wishlist ─────────────────────────────────────────────────────────────────
app.get('/api/wishlist', authenticate, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT w.id as wishlist_id, w.product_id, p.name, p.price, p.original_price,
              p.discount, p.image, p.brand, p.stock, p.rating, p.rating_count
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.userId]
    );
    res.json(items);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/wishlist', authenticate, async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'Product ID is required' });
    const [products] = await db.query('SELECT id FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    const [existing] = await db.query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.userId, product_id]);
    if (existing.length > 0) return res.status(400).json({ message: 'Product already in wishlist' });
    const [result] = await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.userId, product_id]);
    res.status(201).json({ message: 'Added to wishlist', wishlist_id: result.insertId });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/wishlist/:productId', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.userId, req.params.productId]);
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Contact ──────────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );
    return res.status(201).json({ success: true, message: 'Message saved successfully.', id: result.insertId });
  } catch (err) {
    console.error('Contact insert error:', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, message, created_time FROM contact ORDER BY created_time DESC'
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Contact fetch error:', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// ── Follow routes ────────────────────────────────────────────────────────────
app.get('/api/follow/count', async (req, res) => {
  try {
    const [[row]] = await db.query('SELECT COUNT(*) as count FROM follows');
    res.json({ count: row.count });
  } catch (err) {
    console.error('Follow count error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/follow/status', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM follows WHERE user_id = ?', [req.userId]);
    res.json({ following: rows.length > 0 });
  } catch (err) {
    console.error('Follow status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/follow/toggle', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM follows WHERE user_id = ?', [req.userId]);
    if (rows.length > 0) {
      await db.query('DELETE FROM follows WHERE user_id = ?', [req.userId]);
      const [[countRow]] = await db.query('SELECT COUNT(*) as count FROM follows');
      res.json({ following: false, count: countRow.count });
    } else {
      await db.query('INSERT INTO follows (user_id) VALUES (?)', [req.userId]);
      const [[countRow]] = await db.query('SELECT COUNT(*) as count FROM follows');
      res.json({ following: true, count: countRow.count });
    }
  } catch (err) {
    console.error('Follow toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/follow/followers', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         u.id         AS _id,
         u.name,
         u.email,
         u.avatar,
         f.created_at AS followedAt
       FROM follows f
       JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC`
    );
    res.json({ followers: rows });
  } catch (err) {
    console.error('Followers list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Follow Notification Routes ───────────────────────────────────────────────

// Helper: create a nodemailer transporter using Ethereal (test email)
const createMailTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return { transporter, testAccount };
};

// POST /api/follow/notify/like  — email + save to DB
app.post('/api/follow/notify/like', authenticate, async (req, res) => {
  try {
    const { toEmail, toName, fromName, fromEmail } = req.body;
    if (!toEmail || !toName || !fromName)
      return res.status(400).json({ message: 'toEmail, toName and fromName are required' });

    /* find to_user_id by email */
    const [toUsers] = await db.query('SELECT id FROM users WHERE email = ?', [toEmail]);
    const toUserId  = toUsers[0]?.id || null;
    if (toUserId) {
      await db.query(
        `INSERT INTO follow_notifications (to_user_id, from_user_id, from_name, from_email, type, message)
         VALUES (?, ?, ?, ?, 'like', NULL)`,
        [toUserId, req.userId, fromName, fromEmail || '']
      );
    }

    try {
      const { transporter } = await createMailTransporter();

      const info = await transporter.sendMail({
        from: '"Harikart" <noreply@harikart.com>',
        to: toEmail,
        subject: `${fromName} liked your follow on Harikart ❤️`,
        html: `
          <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#fff;border:1px solid #e9d5ff;border-radius:16px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ea580c);padding:28px 24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Harikart ❤️</h1>
            </div>
            <div style="padding:28px 24px;">
              <p style="font-size:16px;color:#1e1b4b;font-weight:700;margin:0 0 10px;">Hey ${toName}! 👋</p>
              <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 20px;">
                <strong style="color:#7c3aed;">${fromName}</strong>
                liked your follow on <strong>Harikart</strong>! ❤️
              </p>
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                Visit <a href="http://localhost:5173/follow" style="color:#7c3aed;text-decoration:none;font-weight:600;">Harikart Follow Page</a> to see your notifications.
              </p>
            </div>
          </div>
        `,
        text: `Hey ${toName}! ${fromName} liked your follow on Harikart.`,
      });
      console.log(`\n✅ Like notification sent to ${toEmail}`);
      console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (mailErr) {
      console.log('Email skipped:', mailErr.message);
    }
    res.json({ message: 'Like notification saved' });
  } catch (err) {
    console.error('Follow notify/like error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/follow/notify/comment  — email + save to DB
app.post('/api/follow/notify/comment', authenticate, async (req, res) => {
  try {
    const { toEmail, toName, fromName, fromEmail, message } = req.body;
    if (!toEmail || !toName || !fromName || !message)
      return res.status(400).json({ message: 'toEmail, toName, fromName and message are required' });

    const [toUsers] = await db.query('SELECT id FROM users WHERE email = ?', [toEmail]);
    const toUserId  = toUsers[0]?.id || null;
    if (toUserId) {
      await db.query(
        `INSERT INTO follow_notifications (to_user_id, from_user_id, from_name, from_email, type, message)
         VALUES (?, ?, ?, ?, 'comment', ?)`,
        [toUserId, req.userId, fromName, fromEmail || '', message]
      );
    }

    try {
      const { transporter } = await createMailTransporter();
      const info = await transporter.sendMail({
        from: '"Harikart" <noreply@harikart.com>',
        to: toEmail,
        subject: `${fromName} commented on your follow 💬`,
        html: `
          <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#fff;border:1px solid #e9d5ff;border-radius:16px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ea580c);padding:28px 24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Harikart 💬</h1>
            </div>
            <div style="padding:28px 24px;">
              <p style="font-size:16px;color:#1e1b4b;font-weight:700;margin:0 0 10px;">Hey ${toName}! 👋</p>
              <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 16px;">
                <strong style="color:#7c3aed;">${fromName}</strong> left a comment for you:
              </p>
              <div style="background:#f5f3ff;border-left:4px solid #7c3aed;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
                <p style="font-size:14px;color:#4c1d95;font-style:italic;margin:0;">&quot;${message}&quot;</p>
              </div>
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                Visit <a href="http://localhost:5173/follow" style="color:#7c3aed;text-decoration:none;font-weight:600;">Harikart Follow Page</a> to reply.
              </p>
            </div>
          </div>
        `,
        text: `Hey ${toName}! ${fromName} commented: "${message}"`,
      });
      console.log(`\n✅ Comment notification sent to ${toEmail}`);
      console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (mailErr) {
      console.log('Email skipped:', mailErr.message);
    }
    res.json({ message: 'Comment notification saved' });
  } catch (err) {
    console.error('Follow notify/comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/follow/notify/reply  — email + save to DB
app.post('/api/follow/notify/reply', authenticate, async (req, res) => {
  try {
    const { toEmail, toName, fromName, fromEmail, message } = req.body;
    if (!toEmail || !toName || !fromName || !message)
      return res.status(400).json({ message: 'toEmail, toName, fromName and message are required' });

    const [toUsers] = await db.query('SELECT id FROM users WHERE email = ?', [toEmail]);
    const toUserId  = toUsers[0]?.id || null;
    if (toUserId) {
      await db.query(
        `INSERT INTO follow_notifications (to_user_id, from_user_id, from_name, from_email, type, message)
         VALUES (?, ?, ?, ?, 'reply', ?)`,
        [toUserId, req.userId, fromName, fromEmail || '', message]
      );
    }

    try {
      const { transporter } = await createMailTransporter();
      const info = await transporter.sendMail({
        from: '"Harikart" <noreply@harikart.com>',
        to: toEmail,
        subject: `${fromName} replied to your comment ↩️`,
        html: `
          <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#fff;border:1px solid #e9d5ff;border-radius:16px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ea580c);padding:28px 24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Harikart ↩️</h1>
            </div>
            <div style="padding:28px 24px;">
              <p style="font-size:16px;color:#1e1b4b;font-weight:700;margin:0 0 10px;">Hey ${toName}! 👋</p>
              <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 16px;">
                <strong style="color:#7c3aed;">${fromName}</strong> replied to your comment:
              </p>
              <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
                <p style="font-size:14px;color:#14532d;font-style:italic;margin:0;">&quot;${message}&quot;</p>
              </div>
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                Visit <a href="http://localhost:5173/follow" style="color:#7c3aed;text-decoration:none;font-weight:600;">Harikart Follow Page</a> to continue the conversation.
              </p>
            </div>
          </div>
        `,
        text: `Hey ${toName}! ${fromName} replied: "${message}"`,
      });
      console.log(`\n✅ Reply notification sent to ${toEmail}`);
      console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (mailErr) {
      console.log('Email skipped:', mailErr.message);
    }
    res.json({ message: 'Reply notification saved' });
  } catch (err) {
    console.error('Follow notify/reply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── In-page notification routes ────────────────────────────────────────────────────────────────────

// GET /api/follow/my-notifications
app.get('/api/follow/my-notifications', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, from_user_id, from_name, from_email, type, message, is_read, created_at
       FROM follow_notifications
       WHERE to_user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.userId]
    );
    const unreadCount = rows.filter(r => !r.is_read).length;
    res.json({ notifications: rows, unreadCount });
  } catch (err) {
    console.error('my-notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/follow/my-notifications/read-all
app.put('/api/follow/my-notifications/read-all', authenticate, async (req, res) => {
  try {
    await db.query('UPDATE follow_notifications SET is_read = 1 WHERE to_user_id = ?', [req.userId]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/follow/my-notifications/:id/read
app.put('/api/follow/my-notifications/:id/read', authenticate, async (req, res) => {
  try {
    await db.query(
      'UPDATE follow_notifications SET is_read = 1 WHERE id = ? AND to_user_id = ?',
      [req.params.id, req.userId]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/follow/my-notifications/:id/reply
app.post('/api/follow/my-notifications/:id/reply', authenticate, async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText || !replyText.trim())
      return res.status(400).json({ message: 'replyText is required' });

    const [rows] = await db.query(
      'SELECT * FROM follow_notifications WHERE id = ? AND to_user_id = ?',
      [req.params.id, req.userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Notification not found' });
    const original = rows[0];

    const [replierRows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.userId]);
    const replier = replierRows[0];

    /* mark original as read */
    await db.query('UPDATE follow_notifications SET is_read = 1 WHERE id = ?', [req.params.id]);

    /* send reply notification to original sender */
    if (original.from_user_id) {
      await db.query(
        `INSERT INTO follow_notifications (to_user_id, from_user_id, from_name, from_email, type, message)
         VALUES (?, ?, ?, ?, 'reply', ?)`,
        [original.from_user_id, req.userId, replier?.name || 'Someone', replier?.email || '', replyText.trim()]
      );
    }

    res.json({ message: 'Reply sent' });
  } catch (err) {
    console.error('reply notification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/follow/chat/:partnerId
app.get('/api/follow/chat/:partnerId', authenticate, async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const [rows] = await db.query(
      `SELECT id, to_user_id, from_user_id, from_name, from_email, type, message, is_read, created_at
       FROM follow_notifications
       WHERE (to_user_id = ? AND from_user_id = ?)
          OR (to_user_id = ? AND from_user_id = ?)
       ORDER BY created_at ASC`,
      [req.userId, partnerId, partnerId, req.userId]
    );
    res.json({ chat: rows });
  } catch (err) {
    console.error('get chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/follow/chat/:partnerId
app.delete('/api/follow/chat/:partnerId', authenticate, async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    await db.query(
      `DELETE FROM follow_notifications
       WHERE (to_user_id = ? AND from_user_id = ?)
          OR (to_user_id = ? AND from_user_id = ?)`,
      [req.userId, partnerId, partnerId, req.userId]
    );
    res.json({ message: 'Chat cleared' });
  } catch (err) {
    console.error('clear chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/follow/chat/:partnerId/read-all
app.put('/api/follow/chat/:partnerId/read-all', authenticate, async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    await db.query(
      'UPDATE follow_notifications SET is_read = 1 WHERE to_user_id = ? AND from_user_id = ? AND type = "comment"',
      [req.userId, partnerId]
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('read all chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/follow/blocked
app.get('/api/follow/blocked', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT blocked_id FROM blocked_users WHERE blocker_id = ?', [req.userId]);
    res.json({ blockedUsers: rows.map(r => r.blocked_id) });
  } catch (err) {
    console.error('get blocked error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/follow/block/:userId
app.post('/api/follow/block/:userId', authenticate, async (req, res) => {
  try {
    const targetId = req.params.userId;
    if (req.userId == targetId) return res.status(400).json({ message: 'Cannot block yourself' });
    await db.query('INSERT IGNORE INTO blocked_users (blocker_id, blocked_id) VALUES (?, ?)', [req.userId, targetId]);
    res.json({ message: 'User blocked' });
  } catch (err) {
    console.error('block error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/follow/block/:userId
app.delete('/api/follow/block/:userId', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?', [req.userId, req.params.userId]);
    res.json({ message: 'User unblocked' });
  } catch (err) {
    console.error('unblock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/follow/chat/:partnerId/send
app.post('/api/follow/chat/:partnerId/send', authenticate, async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Check for block
    const [blockCheck] = await db.query(
      'SELECT * FROM blocked_users WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)',
      [req.userId, partnerId, partnerId, req.userId]
    );
    if (blockCheck.length > 0) {
      return res.status(403).json({ message: 'Cannot send message to this user. Interaction blocked.' });
    }

    const [partnerRows] = await db.query('SELECT name, email FROM users WHERE id = ?', [partnerId]);
    if (partnerRows.length === 0) return res.status(404).json({ message: 'User not found' });
    const partner = partnerRows[0];
    const partnerName = partner.name;

    const [senderRows] = await db.query('SELECT name, email FROM users WHERE id = ?', [req.userId]);
    const sender = senderRows[0];
    const senderName = sender.name;

    await db.query(
      `INSERT INTO follow_notifications (to_user_id, from_user_id, from_name, from_email, type, message)
       VALUES (?, ?, ?, ?, 'comment', ?)`,
      [partnerId, req.userId, senderName, sender.email, message.trim()]
    );

    try {
      const { transporter } = await createMailTransporter();
      await transporter.sendMail({
        from: '"Harikart" <noreply@harikart.com>',
        to: partner.email,
        subject: `${senderName} sent you a message on Harikart 💬`,
        text: `Hey ${partnerName}! ${senderName} messaged: "${message.trim()}"`,
      });
    } catch (mailErr) {
      console.log('Background mail failed:', mailErr.message);
    }

    res.json({ message: 'Message sent' });
  } catch (err) {
    console.error('send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Store Profile ────────────────────────────────────────────────────────────
app.get('/api/store/profile', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name, handle, bio, avatar FROM store_profile LIMIT 1');
    if (rows.length === 0) {
      return res.json({
        name:   'Harikart',
        handle: '@harikart.official',
        bio:    'Your one-stop destination for the best deals on electronics, fashion, and more. 🛍️',
        avatar: null,
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Store profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/store/profile', authenticate, async (req, res) => {
  try {
    const { name, handle, bio, avatar } = req.body;
    const [rows] = await db.query('SELECT id FROM store_profile LIMIT 1');

    if (rows.length > 0) {
      await db.query(
        `UPDATE store_profile SET
           name   = COALESCE(?, name),
           handle = COALESCE(?, handle),
           bio    = COALESCE(?, bio),
           avatar = COALESCE(?, avatar)
         WHERE id = ?`,
        [name || null, handle || null, bio || null, avatar || null, rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO store_profile (name, handle, bio, avatar) VALUES (?, ?, ?, ?)',
        [name || 'Harikart', handle || '@harikart.official', bio || '', avatar || null]
      );
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Store profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/store/avatar', authenticate, async (req, res) => {
  try {
    const { avatar } = req.body;
    const [rows] = await db.query('SELECT id FROM store_profile LIMIT 1');
    if (rows.length > 0) {
      await db.query('UPDATE store_profile SET avatar = ? WHERE id = ?', [avatar ?? null, rows[0].id]);
    } else {
      await db.query('INSERT INTO store_profile (avatar) VALUES (?)', [avatar ?? null]);
    }
    res.json({ message: avatar ? 'Avatar updated' : 'Avatar removed' });
  } catch (err) {
    console.error('Store avatar update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Blog routes ──────────────────────────────────────────────────────────────
const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return raw.split(',').map(t => t.trim()).filter(Boolean); }
};

app.get('/blogs', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, content, tags, created_at, updated_at FROM blogs ORDER BY created_at ASC'
    );
    res.json(rows.map(b => ({ ...b, tags: parseTags(b.tags) })));
  } catch (err) {
    console.error('Blog fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/blogs/search', async (req, res) => {
  try {
    const { q = '' } = req.query;
    const like = `%${q}%`;
    const [rows] = await db.query(
      `SELECT id, title, content, tags, created_at, updated_at
       FROM blogs WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
       ORDER BY created_at DESC`,
      [like, like, like]
    );
    const blogs = rows.map(b => ({ ...b, tags: parseTags(b.tags) }));
    if (q.trim()) {
      if (blogs.length > 0) {
        for (const blog of blogs) {
          await db.query('INSERT INTO search_history (blog_id, blog_title, action) VALUES (?, ?, ?)', [blog.id, blog.title, 'search']);
        }
      } else {
        await db.query('INSERT INTO search_history (blog_id, blog_title, action) VALUES (?, ?, ?)', [null, q.trim(), 'search_no_result']);
      }
    }
    res.json(blogs);
  } catch (err) {
    console.error('Blog search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, content, tags, created_at, updated_at FROM blogs WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    const blog = { ...rows[0], tags: parseTags(rows[0].tags) };
    await db.query('INSERT INTO search_history (blog_id, blog_title, action) VALUES (?, ?, ?)', [blog.id, blog.title, 'view']);
    res.json(blog);
  } catch (err) {
    console.error('Blog get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/blogs', async (req, res) => {
  try {
    const { title, content, tags = [], date } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const tagsJson  = JSON.stringify(Array.isArray(tags) ? tags : []);
    const createdAt = date ? new Date(date) : new Date();
    const [result]  = await db.query(
      'INSERT INTO blogs (title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), content.trim(), tagsJson, createdAt, createdAt]
    );
    await db.query('INSERT INTO search_history (blog_id, blog_title, action) VALUES (?, ?, ?)', [result.insertId, title.trim(), 'create']);
    res.status(201).json({ id: result.insertId, title: title.trim(), content: content.trim(), tags: Array.isArray(tags) ? tags : [], created_at: createdAt, updated_at: createdAt });
  } catch (err) {
    console.error('Blog create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/blogs/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const [existing] = await db.query('SELECT id FROM blogs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Blog not found' });
    const fields = [], params = [];
    if (title !== undefined)   { fields.push('title = ?');   params.push(title.trim()); }
    if (content !== undefined) { fields.push('content = ?'); params.push(content.trim()); }
    if (tags !== undefined)    { fields.push('tags = ?');    params.push(JSON.stringify(Array.isArray(tags) ? tags : [])); }
    if (fields.length === 0) return res.status(400).json({ message: 'Nothing to update' });
    fields.push('updated_at = ?'); params.push(new Date()); params.push(req.params.id);
    await db.query(`UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`, params);
    await db.query('INSERT INTO search_history (blog_id, blog_title, action) VALUES (?, ?, ?)', [req.params.id, title?.trim() || '', 'update']);
    const [updated] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ ...updated[0], tags: parseTags(updated[0].tags) });
  } catch (err) {
    console.error('Blog update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id, title FROM blogs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Blog not found' });
    await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    await db.query('INSERT INTO search_history (blog_id, blog_title, action) VALUES (?, ?, ?)', [null, existing[0].title, 'delete']);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Blog delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/search-history', async (req, res) => {
  try {
    const { limit = 50, action } = req.query;
    let query  = 'SELECT id, blog_id, blog_title, action, created_at FROM search_history';
    const params = [];
    if (action) { query += ' WHERE action = ?'; params.push(action); }
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Search history fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/search-history/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM search_history WHERE id = ?', [req.params.id]);
    res.json({ message: 'History entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/search-history', async (req, res) => {
  try {
    await db.query('DELETE FROM search_history');
    res.json({ message: 'Search history cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── User avatar ──────────────────────────────────────────────────────────────
(async () => {
  try {
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar MEDIUMTEXT`);
    console.log('✅ users.avatar column ready');
  } catch (err) {
    console.log('ℹ️  users.avatar column already exists or added');
  }
})();

app.get('/api/user/avatar', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT avatar FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ avatar: rows[0].avatar || null });
  } catch (err) {
    console.error('Get user avatar error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/user/avatar', authenticate, async (req, res) => {
  try {
    const { avatar } = req.body;
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatar ?? null, req.userId]);
    res.json({ message: avatar ? 'Avatar updated' : 'Avatar removed' });
  } catch (err) {
    console.error('Update user avatar error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Flipkart Backend running on http://localhost:${PORT}`);
});