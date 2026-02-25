import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, deleteProduct, updateQuantity } from './services/api';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import QuantityModal from './components/QuantityModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [quantityProduct, setQuantityProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      const data = await getProducts(params);
      setProducts(data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      showToast('"' + deleteTarget.name + '" deleted');
      fetchProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleQuantityUpdate = async (id, quantity) => {
    try {
      await updateQuantity(id, quantity);
      setQuantityProduct(null);
      showToast('Quantity updated');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const handleProductSaved = () => {
    setShowAddModal(false);
    setEditProduct(null);
    fetchProducts();
    getCategories().then(setCategories).catch(() => {});
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Inventory Manager</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Retail Store Management</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Products" value={totalProducts} icon="📦" color="bg-blue-50 text-blue-600" />
          <StatCard label="Inventory Value" value={'$' + totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} icon="💰" color="bg-green-50 text-green-600" />
          <StatCard label="Low Stock" value={lowStock} icon="⚠️" color="bg-yellow-50 text-yellow-600" />
          <StatCard label="Out of Stock" value={outOfStock} icon="🚫" color="bg-red-50 text-red-600" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, SKU or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <ProductTable
          products={products}
          loading={loading}
          onEdit={p => setEditProduct(p)}
          onDelete={p => setDeleteTarget(p)}
          onUpdateQuantity={p => setQuantityProduct(p)}
        />
      </main>

      {(showAddModal || editProduct) && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={() => { setShowAddModal(false); setEditProduct(null); }}
          onSaved={handleProductSaved}
          onToast={showToast}
        />
      )}
      {quantityProduct && (
        <QuantityModal
          product={quantityProduct}
          onClose={() => setQuantityProduct(null)}
          onSave={handleQuantityUpdate}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message={'Are you sure you want to delete "' + deleteTarget.name + '"? This action cannot be undone.'}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={'text-2xl p-1.5 rounded-lg ' + color}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
