import { useState, useCallback } from 'react';

const STORAGE_KEY = 'golf_swing_sessions';

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useStorage() {
  const [sessions, setSessions] = useState(loadSessions);

  const addSession = useCallback((session) => {
    setSessions((prev) => {
      const next = [session, ...prev];
      saveSessions(next);
      return next;
    });
  }, []);

  const updateSession = useCallback((id, updater) => {
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === id ? updater(s) : s));
      saveSessions(next);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSessions(next);
      return next;
    });
  }, []);

  return { sessions, addSession, updateSession, deleteSession };
}
