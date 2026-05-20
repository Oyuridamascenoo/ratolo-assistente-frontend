import { useState, useEffect, useCallback } from 'react';
import Topbar from './components/Topbar/Topbar.jsx';
import Onboarding from './components/Onboarding/Onboarding.jsx';
import Chat from './components/Chat/Chat.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import { api } from './services/api.js';
import styles from './App.module.css';

const SEEN_KEY = 'ratolo_onboarding_seen';

function App() {
  const [stage, setStage] = useState(() =>
    localStorage.getItem(SEEN_KEY) ? 'chat' : 'onboarding'
  );
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  function finishOnboarding() {
    localStorage.setItem(SEEN_KEY, '1');
    setStage('chat');
    loadSessions();
  }

  function loadSessions() {
    api.getSessions()
      .then(async (list) => {
        setApiOnline(true);
        if (list.length === 0) {
          const s = await api.createSession();
          setSessions([s]);
          setActiveId(s.id);
        } else {
          setSessions(list);
          setActiveId(id => id ?? list[0].id);
        }
      })
      .catch(() => setApiOnline(false));
  }

  useEffect(() => { loadSessions(); }, []);

  const newChat = useCallback(async () => {
    const s = await api.createSession().catch(() => null);
    if (!s) return;
    setSessions(prev => [s, ...prev]);
    setActiveId(s.id);
  }, []);

  const deleteChat = useCallback(async (id) => {
    await api.deleteSession(id).catch(() => {});
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }, [activeId]);

  const refreshSessions = useCallback(() => {
    api.getSessions().then(list => { setSessions(list); setApiOnline(true); }).catch(() => {});
  }, []);

  const activeSession = sessions.find(s => s.id === activeId) ?? sessions[0];

  return (
    <div className={styles.app}>
      <Topbar
        stage={stage}
        onShowTour={() => setStage('onboarding')}
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        sidebarCollapsed={sidebarCollapsed}
      />
      {stage === 'onboarding' ? (
        <Onboarding onStartChat={finishOnboarding} />
      ) : (
        <div className={styles.chatLayout}>
          <Sidebar
            chats={sessions}
            activeChatId={activeSession?.id}
            onSelect={setActiveId}
            onNew={newChat}
            onDelete={deleteChat}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(v => !v)}
          />
          {!apiOnline ? (
            <div className={styles.offlineState}>
              <div className={styles.offlineIcon}>⚠</div>
              <div className={styles.offlineTitle}>API offline</div>
              <div className={styles.offlineMsg}>
                No terminal rode:<br/>
                <code>cd assistente-tecnico-api &amp;&amp; node server.js</code>
              </div>
              <button className={styles.offlineBtn} onClick={loadSessions}>
                Tentar novamente
              </button>
            </div>
          ) : activeSession ? (
            <Chat
              key={activeSession.id}
              sessionId={activeSession.id}
              onMessageSent={refreshSessions}
              onOpenSidebar={() => setSidebarCollapsed(false)}
            />
          ) : (
            <div className={styles.loadingState}>Conectando…</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
