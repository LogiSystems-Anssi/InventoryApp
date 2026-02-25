import { useState } from 'react';

export default function QuantityModal({ product, onClose, onSave }) {
  const [value, setValue] = useState(String(product.quantity));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 0) { setError('Quantity must be 0 or more'); return; }
    setSaving(true);
    await onSave(product.id, qty);
    setSaving(false);
  };

  const adjust = (delta) => {
    const next = Math.max(0, (parseInt(value) || 0) + delta);
    setValue(String(next));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Update Quantity</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4">
            Adjusting stock for <span className="font-semibold text-gray-900">{product.name}</span>
          </p>
          <div className="flex items-center gap-3 mb-3">
            <button type="button" onClick={() => adjust(-1)} className="w-10 h-10 rounded-lg border border-gray-200 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">−</button>
            <input
              type="number"
              min="0"
              value={value}
              onChange={e => { setValue(e.target.value); setError(''); }}
              className={'flex-1 text-center border rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 ' + (error ? 'border-red-400' : 'border-gray-200')}
            />
            <button type="button" onClick={() => adjust(1)} className="w-10 h-10 rounded-lg border border-gray-200 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">+</button>
          </div>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
