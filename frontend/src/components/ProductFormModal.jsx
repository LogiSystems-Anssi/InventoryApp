import { useState } from 'react';
import { createProduct, updateProduct } from '../services/api';

const DEFAULT_CATEGORIES = ['Raw Honey', 'Creamed Honey', 'Infused Honey', 'Beeswax', 'Gift Sets'];

export default function ProductFormModal({ product, categories, onClose, onSaved, onToast }) {
  const isEdit = Boolean(product);
  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])];

  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? 'Raw Honey',
    sku: product?.sku ?? '',
    price: product?.price ?? '',
    quantity: product?.quantity ?? 0,
    description: product?.description ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price is required';
    if (isNaN(Number(form.quantity)) || Number(form.quantity) < 0) e.quantity = 'Quantity must be 0 or more';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
      if (isEdit) {
        await updateProduct(product.id, payload);
        onToast('Product updated');
      } else {
        await createProduct(payload);
        onToast('Product added');
      }
      onSaved();
    } catch (err) {
      onToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => {
      setForm(f => ({ ...f, [name]: e.target.value }));
      setErrors(er => ({ ...er, [name]: undefined }));
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input {...field('name')} className={'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ' + (errors.name ? 'border-red-400' : 'border-gray-200')} placeholder="e.g. Wildflower Raw Honey 500g" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
              <input {...field('sku')} className={'w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 ' + (errors.sku ? 'border-red-400' : 'border-gray-200')} placeholder="e.g. RH-001" />
              {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select {...field('category')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price ($) *</label>
              <input {...field('price')} type="number" min="0" step="0.01" className={'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ' + (errors.price ? 'border-red-400' : 'border-gray-200')} placeholder="0.00" />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
              <input {...field('quantity')} type="number" min="0" className={'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ' + (errors.quantity ? 'border-red-400' : 'border-gray-200')} />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea {...field('description')} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" placeholder="Short product description..." />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
