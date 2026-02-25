export default function Toast({ message, type = 'success' }) {
  const colors = type === 'error'
    ? 'bg-red-600 text-white'
    : 'bg-gray-900 text-white';

  const icon = type === 'error' ? '✕' : '✓';

  return (
    <div className={'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ' + colors}>
      <span className="font-bold">{icon}</span>
      {message}
    </div>
  );
}
