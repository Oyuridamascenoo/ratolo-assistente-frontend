import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api.js';
import styles from './Knowledge.module.css';

export default function Knowledge({ onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null); // null | 'text' | 'file'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const data = await api.getKnowledge();
      setItems(data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  function resetForm() {
    setTitle(''); setContent(''); setFile(null); setError(''); setMode(null);
  }

  async function handleAddText(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true); setError('');
    try {
      await api.addKnowledge(title.trim(), content.trim());
      resetForm();
      await loadItems();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleAddFile(e) {
    e.preventDefault();
    if (!file) return;
    setSaving(true); setError('');
    try {
      await api.uploadFile(file, title.trim() || file.name);
      resetForm();
      await loadItems();
    } catch (err) { setError('Erro ao enviar arquivo. Tente novamente.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este conhecimento?')) return;
    try {
      await api.deleteKnowledge(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {}
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Base de Conhecimento
          </div>
          <div className={styles.headerActions}>
            {mode === null && (
              <>
                <button className={styles.addBtn} onClick={() => setMode('text')}>+ Texto</button>
                <button className={styles.addBtn} onClick={() => setMode('file')}>+ PDF/Arquivo</button>
              </>
            )}
            {mode !== null && (
              <button className={styles.cancelBtn} onClick={resetForm}>Cancelar</button>
            )}
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.tip}>
          <strong>Dica:</strong> No chat, digite <code>aprender: [informação]</code> para salvar diretamente pela conversa.
        </div>

        {mode === 'text' && (
          <form className={styles.addForm} onSubmit={handleAddText}>
            <input
              className={styles.input}
              placeholder="Título (ex: Procedimento nozzle DX5)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
            <textarea
              className={styles.textarea}
              placeholder="Conteúdo técnico — texto livre, listas, procedimentos..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={6}
            />
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.saveBtn} type="submit" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar conhecimento'}
            </button>
          </form>
        )}

        {mode === 'file' && (
          <form className={styles.addForm} onSubmit={handleAddFile}>
            <input
              className={styles.input}
              placeholder="Título (opcional — usa o nome do arquivo se vazio)"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div
              className={`${styles.dropZone} ${file ? styles.dropZoneActive : ''}`}
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md,.csv"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0] || null)}
              />
              {file ? (
                <div className={styles.fileSelected}>
                  <span className={styles.fileIcon}>📄</span>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
              ) : (
                <div className={styles.dropHint}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Clique ou arraste o arquivo aqui</span>
                  <span className={styles.dropTypes}>PDF, TXT, MD, CSV — máx. 10MB</span>
                </div>
              )}
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.saveBtn} type="submit" disabled={saving || !file}>
              {saving ? 'Enviando…' : 'Enviar arquivo'}
            </button>
          </form>
        )}

        <div className={styles.list}>
          {loading && <div className={styles.empty}>Carregando…</div>}
          {!loading && items.length === 0 && mode === null && (
            <div className={styles.empty}>
              Nenhum conhecimento cadastrado ainda.<br/>
              Adicione textos ou PDFs para a IA usar nas respostas.
            </div>
          )}
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{item.title}</span>
                <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Remover">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
              <div className={styles.itemContent}>{item.content.slice(0, 200)}{item.content.length > 200 ? '…' : ''}</div>
              <div className={styles.itemMeta}>{item.type === 'file' ? `📄 ${item.filename}` : '📝 Texto'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
