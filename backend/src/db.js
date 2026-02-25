const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'inventory.db');

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (countRow.count === 0) {
  const seedProducts = [
    { name: 'Wildflower Raw Honey 500g', category: 'Raw Honey', sku: 'RH-001', price: 12.99, quantity: 120, description: 'Pure raw wildflower honey, unfiltered and unpasteurised' },
    { name: 'Manuka Honey UMF 10+ 250g', category: 'Raw Honey', sku: 'RH-002', price: 34.99, quantity: 45, description: 'Certified New Zealand Manuka honey with UMF 10+ rating' },
    { name: 'Buckwheat Honey 500g', category: 'Raw Honey', sku: 'RH-003', price: 14.99, quantity: 80, description: 'Dark, robust raw buckwheat honey rich in antioxidants' },
    { name: 'Clover Honey 1kg', category: 'Raw Honey', sku: 'RH-004', price: 18.99, quantity: 95, description: 'Mild and sweet single-origin clover honey, 1kg jar' },
    { name: 'Acacia Honey 500g', category: 'Raw Honey', sku: 'RH-005', price: 15.99, quantity: 60, description: 'Light floral acacia honey that stays liquid for longer' },
    { name: 'Orange Blossom Honey 250g', category: 'Raw Honey', sku: 'RH-006', price: 11.99, quantity: 70, description: 'Delicately fragrant honey from orange groves' },
    { name: 'Creamed Honey Classic 400g', category: 'Creamed Honey', sku: 'CH-001', price: 13.99, quantity: 85, description: 'Smooth and spreadable pure creamed honey' },
    { name: 'Creamed Honey with Cinnamon 250g', category: 'Creamed Honey', sku: 'CH-002', price: 12.99, quantity: 55, description: 'Whipped honey blended with Ceylon cinnamon' },
    { name: 'Creamed Honey with Lavender 250g', category: 'Creamed Honey', sku: 'CH-003', price: 12.99, quantity: 40, description: 'Velvety creamed honey infused with dried lavender flowers' },
    { name: 'Honey & Chilli Infusion 200g', category: 'Infused Honey', sku: 'IH-001', price: 10.99, quantity: 65, description: 'Raw honey infused with dried chilli for a sweet heat' },
    { name: 'Honey & Lemon Infusion 200g', category: 'Infused Honey', sku: 'IH-002', price: 9.99, quantity: 75, description: 'Bright citrus honey great for teas and dressings' },
    { name: 'Honey & Ginger Infusion 200g', category: 'Infused Honey', sku: 'IH-003', price: 10.49, quantity: 58, description: 'Warming raw honey infused with fresh ginger root' },
    { name: 'Black Truffle Honey 150g', category: 'Infused Honey', sku: 'IH-004', price: 19.99, quantity: 25, description: 'Premium acacia honey infused with black summer truffle' },
    { name: 'Beeswax Pillar Candle Set (3 pcs)', category: 'Beeswax', sku: 'BW-001', price: 22.99, quantity: 30, description: 'Hand-rolled pure beeswax pillar candles, natural honey scent' },
    { name: 'Beeswax Lip Balm', category: 'Beeswax', sku: 'BW-002', price: 4.99, quantity: 150, description: 'Nourishing beeswax and honey lip balm, unscented' },
    { name: 'Beeswax Wood Polish 150ml', category: 'Beeswax', sku: 'BW-003', price: 8.99, quantity: 45, description: 'Natural beeswax furniture polish with lemon oil' },
    { name: 'Beeswax Food Wraps Set of 3', category: 'Beeswax', sku: 'BW-004', price: 14.99, quantity: 60, description: 'Reusable beeswax-coated cotton food wraps, assorted sizes' },
    { name: 'Honey Tasting Gift Box (4 x 100g)', category: 'Gift Sets', sku: 'GS-001', price: 29.99, quantity: 35, description: 'Four award-winning honeys in a presentation gift box' },
    { name: "Beekeeper's Starter Gift Set", category: 'Gift Sets', sku: 'GS-002', price: 49.99, quantity: 15, description: 'Includes raw honey, beeswax candle, lip balm and honey dipper' },
    { name: 'Luxury Honey & Beeswax Hamper', category: 'Gift Sets', sku: 'GS-003', price: 79.99, quantity: 8, description: 'Premium hamper with 6 honey varieties and 4 beeswax products' },
  ];

  const insert = db.prepare(`
    INSERT INTO products (name, category, sku, price, quantity, description)
    VALUES (:name, :category, :sku, :price, :quantity, :description)
  `);

  for (const product of seedProducts) {
    insert.run(product);
  }
  console.log('Database seeded with 20 products.');
}

module.exports = db;
