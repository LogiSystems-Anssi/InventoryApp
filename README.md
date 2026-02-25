# 🍯 Golden Hive — Inventory Manager

A modern web app for managing the inventory of **Golden Hive**, a honey company.

![Golden Hive Screenshot](https://github.com/user-attachments/assets/23f208bb-2d3e-49c7-9e4f-396cc620a12a)

## Features

- **Browse products** — searchable, filterable table with live stats
- **Add / edit products** — form with validation for name, SKU, category, price, quantity and description
- **Delete products** — with a confirmation dialog
- **Update quantity** — inline ± stepper modal per product
- **Stock alerts** — Low Stock (≤ 10) and Out of Stock badges
- **Inventory value** — real-time total calculated from price × quantity
- **20 pre-loaded products** across 5 honey categories:
  - Raw Honey · Creamed Honey · Infused Honey · Beeswax · Gift Sets

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend  | Node.js + Express |
| Database | SQLite (built-in `node:sqlite`, Node.js ≥ 22.5) |

## Getting Started

### Prerequisites
- Node.js **v22.5+** (v24 recommended)

### Install dependencies

```bash
npm run install:all
```

### Development (two terminals)

```bash
# Terminal 1 — API server (http://localhost:3001)
npm run dev:backend

# Terminal 2 — Vite dev server with HMR (http://localhost:5173)
npm run dev:frontend
```

### Production build

```bash
npm run build   # builds frontend/dist
npm start       # serves API + frontend on http://localhost:3001
```

The Express server serves the built React app as static files, so a single
`npm start` is all you need in production.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | List products (supports `?search=` and `?category=`) |
| `GET` | `/api/products/:id` | Get one product |
| `GET` | `/api/categories` | List distinct categories |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `PATCH` | `/api/products/:id/quantity` | Update quantity only |
| `DELETE` | `/api/products/:id` | Delete a product |

## Database

The SQLite database file (`backend/inventory.db`) is created automatically on
first start and seeded with 20 honey products. It is excluded from version
control via `.gitignore`.
