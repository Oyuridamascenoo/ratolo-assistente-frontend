import { useState } from 'react';
import { auth } from '../../services/api.js';
import styles from './Login.module.css';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await auth.login(email, password);
      } else {
        result = await auth.register(name, email, password);
      }
      localStorage.setItem('ratolo_token', result.token);
      localStorage.setItem('ratolo_user', JSON.stringify(result.user));
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>#</span>
          <div>
            <div className={styles.logoTitle}>Assistente Técnico</div>
            <div className={styles.logoSub}>LARGE FORMAT PRINT · V2.1</div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={mode === 'login' ? styles.tabActive : styles.tab}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Entrar
          </button>
          <button
            className={mode === 'register' ? styles.tabActive : styles.tab}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Criar conta
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus={mode === 'login'}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
