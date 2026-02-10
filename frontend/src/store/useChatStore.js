import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const useChatStore = create((set, get) => ({
  messages: [],
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  useContext: false,
  mathMode: false,

  // Initialize sessions and current session
  init: () => {
    const storedSessions = JSON.parse(localStorage.getItem('chat_sessions_v1') || '[]');
    const storedCurrent = localStorage.getItem('chat_current_session_id');
    if (storedSessions.length === 0) {
      const id = `s_${Date.now()}`;
      const initial = [{ id, title: 'New Chat', createdAt: Date.now(), messages: [] }];
      set({ sessions: initial, currentSessionId: id, messages: [] });
    } else {
      const fallbackId = storedCurrent && storedSessions.find(s => s.id === storedCurrent) ? storedCurrent : storedSessions[0].id;
      const sess = storedSessions.find(s => s.id === fallbackId);
      set({ sessions: storedSessions, currentSessionId: fallbackId, messages: sess ? sess.messages || [] : [] });
    }
  },

  // Persist sessions and current session
  persist: () => {
    const { sessions, currentSessionId } = get();
    localStorage.setItem('chat_sessions_v1', JSON.stringify(sessions));
    if (currentSessionId) localStorage.setItem('chat_current_session_id', currentSessionId);
  },

  // Actions
  createNewSession: () => {
    const id = `s_${Date.now()}`;
    const newSession = { id, title: 'New Chat', createdAt: Date.now(), messages: [] };
    set(state => ({ sessions: [newSession, ...state.sessions], currentSessionId: id, messages: [] }));
    get().persist();
  },

  selectSession: (id) => {
    const { sessions } = get();
    const sess = sessions.find(s => s.id === id);
    set({ currentSessionId: id, messages: sess ? sess.messages || [] : [] });
    get().persist();
  },

  deleteSession: (id) => {
    set(state => {
      const filtered = state.sessions.filter(s => s.id !== id);
      if (id === state.currentSessionId) {
        if (filtered.length === 0) {
          const nid = `s_${Date.now()}`;
          const empty = { id: nid, title: 'New Chat', createdAt: Date.now(), messages: [] };
          return { sessions: [empty], currentSessionId: nid, messages: [] };
        } else {
          const nid = filtered[0].id;
          return { sessions: filtered, currentSessionId: nid, messages: filtered[0].messages || [] };
        }
      }
      return { sessions: filtered };
    });
    get().persist();
  },

  renameSession: (id, title) => {
    set(state => ({
      sessions: state.sessions.map(s => (s.id === id ? { ...s, title } : s))
    }));
    get().persist();
  },

  importSessions: (incoming) => {
    set(state => {
      const byId = new Map(state.sessions.map(s => [s.id, s]));
      for (const s of incoming) {
        let id = s.id || `s_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
        while (byId.has(id)) {
          id = `${id}_dup`;
        }
        byId.set(id, { ...s, id });
      }
      const merged = Array.from(byId.values()).sort((a,b)=> b.createdAt - a.createdAt);
      const still = merged.find(x => x.id === state.currentSessionId);
      return {
        sessions: merged,
        currentSessionId: still ? still.id : merged[0]?.id || null,
        messages: still ? still.messages || [] : (merged[0]?.messages || []),
      };
    });
    get().persist();
  },

  handleSendMessage: async (inputMessage) => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage };
    set(state => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    set(state => {
      const idx = state.sessions.findIndex(s => s.id === state.currentSessionId);
      if (idx === -1) return {};
      const updated = [...state.sessions];
      const sess = { ...updated[idx] };
      const isFirst = (sess.messages || []).length === 0;
      const newTitle = isFirst ? (inputMessage.length > 40 ? inputMessage.slice(0, 40) + '…' : inputMessage) : sess.title;
      sess.title = newTitle;
      sess.messages = [...(sess.messages || []), userMessage];
      updated[idx] = sess;
      return { sessions: updated };
    });

    try {
      const { useContext } = get();
      const response = await axios.post(`${API_BASE_URL}/ask`, {
        question: inputMessage,
        language: 'en',
        use_context: useContext,
        math_mode: get().mathMode
      });

      const aiMessage = {
        type: 'ai',
        content: response.data.answer,
        sources: response.data.sources || []
      };
      set(state => ({ messages: [...state.messages, aiMessage] }));
      set(state => {
        const idx = state.sessions.findIndex(s => s.id === state.currentSessionId);
        if (idx === -1) return {};
        const updated = [...state.sessions];
        const sess = { ...updated[idx] };
        sess.messages = [...(sess.messages || []), aiMessage];
        updated[idx] = sess;
        return { sessions: updated };
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'ai',
        content: error.response?.data?.detail || 'Sorry, I encountered an error. Please try again.',
        sources: []
      };
      set(state => ({ messages: [...state.messages, errorMessage] }));
      set(state => {
        const idx = state.sessions.findIndex(s => s.id === state.currentSessionId);
        if (idx === -1) return {};
        const updated = [...state.sessions];
        const sess = { ...updated[idx] };
        sess.messages = [...(sess.messages || []), errorMessage];
        updated[idx] = sess;
        return { sessions: updated };
      });
    } finally {
      set({ isLoading: false });
      get().persist();
    }
  },

  clearChat: () => {
    set({ messages: [] });
    set(state => {
      const idx = state.sessions.findIndex(s => s.id === state.currentSessionId);
      if (idx === -1) return {};
      const updated = [...state.sessions];
      updated[idx] = { ...updated[idx], messages: [] };
      return { sessions: updated };
    });
    get().persist();
  },

  setUseContext: (useContext) => set({ useContext }),

  setMathMode: (mathMode) => set({ mathMode }),

  addSystemMessage: (content) => {
    const systemMessage = { type: 'ai', content, sources: [] };
    set(state => ({ messages: [...state.messages, systemMessage] }));
    set(state => {
      const idx = state.sessions.findIndex(s => s.id === state.currentSessionId);
      if (idx === -1) return {};
      const updated = [...state.sessions];
      const sess = { ...updated[idx] };
      sess.messages = [...(sess.messages || []), systemMessage];
      updated[idx] = sess;
      return { sessions: updated };
    });
    get().persist();
  },
}));

export default useChatStore;
