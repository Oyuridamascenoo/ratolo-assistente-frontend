import { useState } from 'react';
import { auth } from '../../services/api.js';
import styles from './Login.module.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await auth.login(email.trim(), password);
      localStorage.setItem('ratolo_token', result.token);
      localStorage.setItem('ratolo_user', JSON.stringify(result.user));
      onLogin(result.user);
    } catch (err) {
      setError('Usuário ou senha incorretos');
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

        <div className={styles.subtitle}>
          Entre com seu usuário e senha para acessar o assistente.
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label className={styles.label}>Usuário</label>
            <input
              className={styles.input}
              type="text"
              placeholder="yuri ou raphael"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus={mode === 'login'}
              autoComplete="username"
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
            {loading ? 'Aguarde…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
