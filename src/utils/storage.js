const CHATS_KEY = 'ratolo_chats';

export function loadChats() {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveChats(chats) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function createChat(id) {
  return { id, title: 'Nova conversa', messages: [], createdAt: Date.now() };
}

export function chatTitle(chat) {
  // Sessions from API have a 'title' field directly
  if (chat.title && chat.title !== 'Nova conversa') return chat.title;
  // Fallback for old localStorage format
  const firstUser = chat.messages?.find(m => m.type === 'user');
  if (!firstUser) return 'Nova conversa';
  return firstUser.text.length > 38
    ? firstUser.text.slice(0, 38) + '…'
    : firstUser.text;
}
