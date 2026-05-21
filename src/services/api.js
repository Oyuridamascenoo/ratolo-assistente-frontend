const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('ratolo_token');
}

async function req(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

// Auth
export const auth = {
  register: (name, email, password) => req('POST', '/api/auth/register', { name, email, password }),
  login: (email, password) => req('POST', '/api/auth/login', { email, password }),
  me: () => req('GET', '/api/auth/me'),
};

// Chat sessions
export const api = {
  getSessions: () => req('GET', '/api/chat/sessions'),
  createSession: () => req('POST', '/api/chat/sessions'),
  deleteSession: (id) => req('DELETE', `/api/chat/sessions/${id}`),
  getMessages: (id) => req('GET', `/api/chat/sessions/${id}/messages`),
  sendMessage: (id, content) => req('POST', `/api/chat/sessions/${id}/messages`, { content }),

  // Knowledge base
  getKnowledge: () => req('GET', '/api/knowledge'),
  addKnowledge: (title, content) => req('POST', '/api/knowledge', { title, content }),
  updateKnowledge: (id, title, content) => req('PUT', `/api/knowledge/${id}`, { title, content }),
  deleteKnowledge: (id) => req('DELETE', `/api/knowledge/${id}`),
  uploadFile: async (file, title) => {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    const res = await fetch(`${BASE}/api/knowledge/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
