import styles from './Topbar.module.css';

export default function Topbar({ stage, onShowTour, user, onLogout }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <div className={styles.brandMark}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9h18"/><path d="M3 15h18"/><path d="M7 5v14"/><path d="M17 5v14"/>
          </svg>
        </div>
        <div className={styles.brandName}>
          <span>Assistente Técnico</span>
          <span className={styles.small}>Large Format Print · v2.1</span>
        </div>
      </div>

      <div className={styles.sessionMeta}>
        {stage === 'chat' && (
          <button className={styles.tourBtn} onClick={onShowTour} title="Ver apresentação novamente">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Apresentação
          </button>
        )}
        <span className={`${styles.pill} ${styles.always}`}>
          <span className={styles.statusDot} />
          <span>{stage === 'chat' ? 'Chat ativo' : 'Apresentação'}</span>
        </span>
        <span className={styles.pill}>
          <span>MODEL · CLAUDE 4.5</span>
        </span>
        {user && (
          <div className={styles.userArea}>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={onLogout} title="Sair">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
