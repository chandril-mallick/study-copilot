import { useState, useRef } from 'react';
import useChatStore from '../store/useChatStore';
import { FileUp, FileDown, Trash2, Edit, Check, X } from 'lucide-react';

const HistorySidebar = () => {
  const {
    sessions,
    currentSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    renameSession,
    importSessions,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const importInputRef = useRef(null);

  const exportSessions = () => {
    const data = { version: 1, exportedAt: Date.now(), sessions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dabba_ai_sessions_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => importInputRef.current?.click();
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = parsed.sessions || [];
      if (!Array.isArray(incoming)) return;
      importSessions(incoming);
    } catch (err) {
      console.error('Import failed', err);
    } finally {
      e.target.value = '';
    }
  };

  const startRename = (id, currentTitle) => {
    setRenamingId(id);
    setRenameValue(currentTitle || '');
  };

  const commitRename = (save) => {
    if (!renamingId) return;
    const id = renamingId;
    const title = (renameValue || '').trim();
    if (save && title) {
      renameSession(id, title);
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const onRenameKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitRename(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      commitRename(false);
    }
  };

  const filteredSessions = sessions.filter(s => (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-4 max-h-[80vh] overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">History</h3>
        <div className="flex items-center gap-2">
          <button onClick={exportSessions} title="Export sessions" className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"><FileUp size={12} /></button>
          <button onClick={handleImportClick} title="Import sessions" className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"><FileDown size={12} /></button>
          <button onClick={createNewSession} className="text-xs px-2 py-1 rounded bg-primary text-white">New</button>
        </div>
        <input ref={importInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
      </div>
      <div className="mb-3">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search sessions..." className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
      </div>
      <div className="space-y-2">
        {filteredSessions.map(s => (
          <div key={s.id} className={`group border rounded-lg p-2 cursor-pointer ${s.id === currentSessionId ? 'border-primary bg-blue-50 dark:bg-gray-700/50' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'}`}
            onClick={() => selectSession(s.id)}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                {renamingId === s.id ? (
                  <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={() => commitRename(true)} onKeyDown={onRenameKey} className="w-full text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100" />
                ) : (
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{s.title || 'Untitled'}</p>
                )}
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{new Date(s.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); startRename(s.id, s.title) }} className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"><Edit size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id) }} className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"><Trash2 size={10} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;
