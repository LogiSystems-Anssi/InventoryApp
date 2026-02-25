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
    { name: 'Wireless Keyboard', category: 'Electronics', sku: 'EL-001', price: 49.99, quantity: 35, description: 'Compact wireless keyboard with long battery life' },
    { name: 'USB-C Hub', category: 'Electronics', sku: 'EL-002', price: 34.99, quantity: 50, description: '7-in-1 USB-C hub with HDMI and card reader' },
    { name: 'Ergonomic Mouse', category: 'Electronics', sku: 'EL-003', price: 59.99, quantity: 28, description: 'Vertical ergonomic mouse for reduced wrist strain' },
    { name: 'Monitor Stand', category: 'Office', sku: 'OF-001', price: 29.99, quantity: 42, description: 'Adjustable aluminum monitor riser stand' },
    { name: 'Desk Organizer', category: 'Office', sku: 'OF-002', price: 19.99, quantity: 60, description: 'Bamboo desktop organizer with multiple compartments' },
    { name: 'Office Chair Mat', category: 'Office', sku: 'OF-003', price: 44.99, quantity: 15, description: 'Heavy-duty chair mat for hardwood floors' },
    { name: 'Notebook Set', category: 'Stationery', sku: 'ST-001', price: 12.99, quantity: 100, description: 'Set of 3 lined notebooks, A5 size' },
    { name: 'Ballpoint Pens Pack', category: 'Stationery', sku: 'ST-002', price: 7.99, quantity: 200, description: 'Pack of 12 ballpoint pens, black ink' },
    { name: 'Sticky Notes', category: 'Stationery', sku: 'ST-003', price: 5.49, quantity: 150, description: 'Multicolor sticky notes 3x3 inch, 12 pads' },
    { name: 'Laptop Sleeve 15"', category: 'Accessories', sku: 'AC-001', price: 22.99, quantity: 45, description: 'Water-resistant neoprene laptop sleeve' },
    { name: 'Webcam HD 1080p', category: 'Electronics', sku: 'EL-004', price: 79.99, quantity: 20, description: 'Full HD webcam with built-in microphone' },
    { name: 'Desk Lamp LED', category: 'Office', sku: 'OF-004', price: 39.99, quantity: 33, description: 'Dimmable LED desk lamp with USB charging port' },
    { name: 'Cable Management Kit', category: 'Accessories', sku: 'AC-002', price: 14.99, quantity: 70, description: 'Cable clips, sleeves and ties bundle' },
    { name: 'Whiteboard 60x90cm', category: 'Office', sku: 'OF-005', price: 54.99, quantity: 12, description: 'Magnetic dry-erase whiteboard with aluminum frame' },
    { name: 'Headphone Stand', category: 'Accessories', sku: 'AC-003', price: 18.99, quantity: 40, description: 'Universal desktop headphone hanger' },
    { name: 'Mechanical Keyboard', category: 'Electronics', sku: 'EL-005', price: 129.99, quantity: 18, description: 'Tenkeyless mechanical keyboard with blue switches' },
    { name: 'Mouse Pad XL', category: 'Accessories', sku: 'AC-004', price: 16.99, quantity: 55, description: 'Extra large desk mat with stitched edges' },
    { name: 'Printer Paper A4', category: 'Stationery', sku: 'ST-004', price: 9.99, quantity: 300, description: 'Box of 500 sheets 80gsm white A4 paper' },
    { name: 'Filing Cabinet', category: 'Office', sku: 'OF-006', price: 89.99, quantity: 8, description: '2-drawer steel filing cabinet with lock' },
    { name: 'Stapler Heavy Duty', category: 'Stationery', sku: 'ST-005', price: 24.99, quantity: 25, description: 'Full-strip heavy duty stapler, 50 sheet capacity' },
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
