// [Claude Code · 2026-10-21] Aviso fijo de problemas de guardado (v4.8.0).
import { useEffect, useState } from 'react';
import { getPersistenceWarnings, onPersistenceWarning } from '../store/persistence';
import { useCharacterStore } from '../store/useCharacterStore';

export function PersistenceBanner() {
  const [messages, setMessages] = useState<string[]>(() => getPersistenceWarnings());
  const exportFullBackup = useCharacterStore((state) => state.exportFullBackup);

  useEffect(() => {
    // Avisos emitidos entre el render inicial y el montaje
    setMessages(getPersistenceWarnings());
    return onPersistenceWarning((msg) => {
      setMessages((prev) => (prev.includes(msg) ? prev : [...prev, msg]));
    });
  }, []);

  if (messages.length === 0) return null;

  const handleExport = () => {
    const blob = new Blob([exportFullBackup()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpr-omni-deck-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[100] bg-[#f59e0b] text-black px-4 py-2 flex flex-wrap items-center gap-3 shadow-lg" role="alert">
      <div className="flex-1 min-w-0 text-xs font-mono-code font-bold space-y-0.5">
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <button
        onClick={handleExport}
        className="px-2.5 py-1 bg-black text-[#f59e0b] font-tech font-bold text-xs rounded-xs"
      >
        Exportar respaldo
      </button>
      <button
        onClick={() => setMessages([])}
        className="px-2 py-1 font-tech font-bold text-xs hover:underline"
        aria-label="Cerrar aviso"
      >
        ✕
      </button>
    </div>
  );
}
