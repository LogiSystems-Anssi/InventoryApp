const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all products (with optional search & category filter)
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push("(name LIKE ? OR sku LIKE ? OR description LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY name ASC';

  try {
    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET distinct categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
    res.json(categories.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, category, sku, price, quantity, description } = req.body;
  if (!name || !category || !sku || price == null) {
    return res.status(400).json({ error: 'name, category, sku, and price are required' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO products (name, category, sku, price, quantity, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, category, sku, parseFloat(price), parseInt(quantity) || 0, description || '');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH update product quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  if (quantity == null || isNaN(quantity) || parseInt(quantity) < 0) {
    return res.status(400).json({ error: 'quantity must be a non-negative number' });
  }
  try {
    const result = db.prepare('UPDATE products SET quantity = ? WHERE id = ?')
      .run(parseInt(quantity), req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const { name, category, sku, price, quantity, description } = req.body;
  if (!name || !category || !sku || price == null) {
    return res.status(400).json({ error: 'name, category, sku, and price are required' });
  }
  try {
    const result = db.prepare(`
      UPDATE products SET name=?, category=?, sku=?, price=?, quantity=?, description=?
      WHERE id=?
    `).run(name, category, sku, parseFloat(price), parseInt(quantity) || 0, description || '', req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve built React frontend
const FRONTEND_DIST = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIST));
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Golden Hive Inventory running on http://localhost:${PORT}`);
});
