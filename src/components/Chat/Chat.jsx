import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../../services/api.js';
import { quickActions } from '../../data/slides.js';
import { BotMessage, UserMessage } from './MessageBubble.jsx';
import styles from './Chat.module.css';

const MODES = [
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'conversao', label: 'Conversão' },
  { id: 'config', label: 'Setup' },
];

export default function Chat({ sessionId, onMessageSent, onOpenSidebar }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [activeMode, setActiveMode] = useState('diagnostico');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load message history when session changes
  useEffect(() => {
    setLoadingHistory(true);
    setMessages([]);
    api.getMessages(sessionId)
      .then(({ messages: msgs }) => {
        setMessages(msgs.map(m => ({
          id: m.id,
          type: m.role === 'user' ? 'user' : 'bot',
          text: m.role === 'user' ? m.content : undefined,
          reply: m.role === 'assistant' ? { type: 'text', text: m.content } : undefined,
        })));
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingHistory(false));
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!loadingHistory) textareaRef.current?.focus();
  }, [loadingHistory]);

  const send = useCallback(async (text) => {
    if (!text.trim() || typing) return;
    setInput('');
    resizeTextarea();

    // Optimistic user message
    const tempId = `tmp-${Date.now()}`;
    setMessages(prev => [...prev, { id: tempId, type: 'user', text }]);
    setTyping(true);

    try {
      const { userMessage, assistantMessage } = await api.sendMessage(sessionId, text);
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        { id: userMessage.id, type: 'user', text: userMessage.content },
        { id: assistantMessage.id, type: 'bot', reply: { type: 'text', text: assistantMessage.content } },
      ]);
      onMessageSent?.();
    } catch (err) {
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        { id: `err-${Date.now()}`, type: 'bot', reply: { type: 'text', text: `Erro: ${err.message}` } },
      ]);
    } finally {
      setTyping(false);
    }
  }, [sessionId, typing, onMessageSent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  return (
    <section className={styles.chat}>
      {/* Header */}
      <div className={styles.chatHead}>
        <div className={styles.chatHeadLeft}>
          <button className={`${styles.btnIcon} ${styles.menuBtn}`} onClick={onOpenSidebar} title="Conversas">
            <svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className={styles.chatAvatar}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <div className={styles.chatTitles}>
            <span className={styles.t1}>Assistente Técnico</span>
            <span className={styles.t2}>
              <span className={styles.live}>● online</span>
              {' · resposta em ~2s'}
            </span>
          </div>
        </div>

        <div className={styles.modeTabs}>
          {MODES.map(m => (
            <div
              key={m.id}
              className={`${styles.tab} ${activeMode === m.id ? styles.tabActive : ''}`}
              onClick={() => setActiveMode(m.id)}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map(msg =>
          msg.type === 'user'
            ? <UserMessage key={msg.id} text={msg.text} />
            : <BotMessage key={msg.id} reply={msg.reply} />
        )}
        {typing && <BotMessage reply={null} isTyping />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className={styles.quickActions}>
        {quickActions.map((qa, i) => (
          <button
            key={i}
            className={styles.qaChip}
            onClick={() => {
              setInput(qa.query);
              textareaRef.current?.focus();
            }}
          >
            <span className={styles.qaIcon}>
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: qa.iconPath }} />
            </span>
            {qa.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className={styles.inputBar}>
        <div className={styles.inputShell}>
          <div className={styles.inputTools}>
            <button
              className={styles.inputTool}
              title="Anexar foto"
              onClick={() => alert('Em produção: anexa imagem do test bar, tela de erro, etc.')}
            >
              <svg viewBox="0 0 24 24">
                <path d="M21 12.79V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6.21"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </button>
            <button className={styles.inputTool} title="Modelo da máquina">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <path d="M3 10h18M8 4v6"/>
              </svg>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className={styles.chatInput}
            rows={1}
            value={input}
            placeholder="Descreva o sintoma, o modelo ou o que precisa configurar…"
            onChange={(e) => { setInput(e.target.value); resizeTextarea(); }}
            onKeyDown={handleKeyDown}
          />

          <button
            className={styles.sendBtn}
            disabled={!input.trim()}
            onClick={() => send(input)}
          >
            <svg viewBox="0 0 24 24"><path d="M12 20V4M5 11l7-7 7 7"/></svg>
          </button>
        </div>

        <div className={styles.inputHint}>
          <span>Dica · descreva sintomas, mande fotos, pergunte voltagens, peça checklist</span>
          <span>
            <span className={styles.kbd}>↵</span>
            {' enviar  '}
            <span className={styles.kbd}>⇧↵</span>
            {' nova linha'}
          </span>
        </div>
      </div>
    </section>
  );
}
