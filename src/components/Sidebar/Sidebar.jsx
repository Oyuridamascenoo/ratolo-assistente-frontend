import styles from './Sidebar.module.css';
import { chatTitle } from '../../utils/storage.js';

export default function Sidebar({ chats, activeChatId, onSelect, onNew, onDelete, collapsed, onToggle }) {
  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && <div className={styles.overlay} onClick={onToggle} />}

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          {!collapsed && <span className={styles.headerLabel}>Conversas</span>}
          <button className={styles.toggleBtn} onClick={onToggle} title={collapsed ? 'Expandir' : 'Recolher'}>
            <svg viewBox="0 0 24 24">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        <button className={`${styles.newBtn} ${collapsed ? styles.newBtnCollapsed : ''}`} onClick={onNew}>
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          {!collapsed && <span>Novo chat</span>}
        </button>

        {!collapsed && (
          <ul className={styles.list}>
            {chats.map(chat => (
              <li key={chat.id}>
                <button
                  className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
                  onClick={() => onSelect(chat.id)}
                >
                  <span className={styles.chatIcon}>
                    <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </span>
                  <span className={styles.chatTitle}>{chatTitle(chat)}</span>
                  {chats.length > 1 && (
                    <button
                      className={styles.deleteBtn}
                      onClick={e => { e.stopPropagation(); onDelete(chat.id); }}
                      title="Excluir"
                    >
                      <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {collapsed && (
          <ul className={styles.listCollapsed}>
            {chats.map(chat => (
              <li key={chat.id}>
                <button
                  className={`${styles.chatDot} ${chat.id === activeChatId ? styles.active : ''}`}
                  onClick={() => onSelect(chat.id)}
                  title={chatTitle(chat)}
                >
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
