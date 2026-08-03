// ============================================
// Collaboration store — WebSocket, presence, changes
// ============================================

import { writable, derived, get } from 'svelte/store';
import type { BookSettings, Chapter } from '@intinyagroup/book-writer';

// Types
export type User = {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  lastSeen: string;
};

export type CursorPosition = {
  userId: string;
  chapterId: string;
  offset: number;
  length: number;
};

export type Change = {
  id: string;
  userId: string;
  chapterId: string;
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content: string;
  timestamp: string;
};

export type Comment = {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  position: number;
  resolved: boolean;
  createdAt: string;
  replies: CommentReply[];
};

export type CommentReply = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type VersionSnapshot = {
  id: string;
  name: string;
  description: string;
  settings: BookSettings;
  createdBy: string;
  createdAt: string;
  size: number;
};

export type CollaborationState = {
  connected: boolean;
  roomId: string;
  users: User[];
  cursors: CursorPosition[];
  comments: Comment[];
  versions: VersionSnapshot[];
  pendingChanges: Change[];
};

// User colors for avatars
const userColors = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
];

// Default state
const defaultState: CollaborationState = {
  connected: false,
  roomId: '',
  users: [],
  cursors: [],
  comments: [],
  versions: [],
  pendingChanges: [],
};

// Store
function createCollaborationStore() {
  const { subscribe, update, set } = writable<CollaborationState>(defaultState);

  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  let userName = 'Anonymous';
  let userColor = userColors[Math.floor(Math.random() * userColors.length)];

  function connect(roomId: string, name: string, serverUrl: string) {
    userName = name;
    update((s) => ({ ...s, roomId }));

    try {
      ws = new WebSocket(`${serverUrl}/ws/${roomId}`);

      ws.onopen = () => {
        update((s) => ({ ...s, connected: true }));
        sendMessage({
          type: 'join',
          userId,
          userName,
          userColor,
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      };

      ws.onclose = () => {
        update((s) => ({ ...s, connected: false }));
        // Auto-reconnect after 3 seconds
        reconnectTimer = setTimeout(() => {
          connect(roomId, name, serverUrl);
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.close();
      ws = null;
    }
    set(defaultState);
  }

  function sendMessage(message: any) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  function handleMessage(message: any) {
    switch (message.type) {
      case 'user-joined':
        update((s) => ({
          ...s,
          users: [...s.users.filter((u) => u.id !== message.userId), {
            id: message.userId,
            name: message.userName,
            color: message.userColor,
            lastSeen: new Date().toISOString(),
          }],
        }));
        break;

      case 'user-left':
        update((s) => ({
          ...s,
          users: s.users.filter((u) => u.id !== message.userId),
          cursors: s.cursors.filter((c) => c.userId !== message.userId),
        }));
        break;

      case 'cursor-update':
        update((s) => ({
          ...s,
          cursors: [
            ...s.cursors.filter((c) => c.userId !== message.userId),
            {
              userId: message.userId,
              chapterId: message.chapterId,
              offset: message.offset,
              length: message.length,
            },
          ],
        }));
        break;

      case 'change':
        update((s) => ({
          ...s,
          pendingChanges: [...s.pendingChanges, message.change],
        }));
        break;

      case 'comment':
        update((s) => ({
          ...s,
          comments: [...s.comments, message.comment],
        }));
        break;

      case 'comment-reply':
        update((s) => ({
          ...s,
          comments: s.comments.map((c) =>
            c.id === message.commentId
              ? { ...c, replies: [...c.replies, message.reply] }
              : c
          ),
        }));
        break;

      case 'version-snapshot':
        update((s) => ({
          ...s,
          versions: [message.snapshot, ...s.versions],
        }));
        break;

      case 'presence':
        update((s) => ({
          ...s,
          users: s.users.map((u) =>
            u.id === message.userId
              ? { ...u, lastSeen: new Date().toISOString() }
              : u
          ),
        }));
        break;
    }
  }

  // Actions
  function updateCursor(chapterId: string, offset: number, length: number) {
    sendMessage({
      type: 'cursor',
      userId,
      chapterId,
      offset,
      length,
    });
  }

  function broadcastChange(change: Omit<Change, 'id' | 'userId' | 'timestamp'>) {
    const fullChange: Change = {
      ...change,
      id: `change-${Date.now()}`,
      userId,
      timestamp: new Date().toISOString(),
    };
    sendMessage({ type: 'change', change: fullChange });
    update((s) => ({
      ...s,
      pendingChanges: [...s.pendingChanges, fullChange],
    }));
  }

  function addComment(chapterId: string, content: string, position: number) {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId,
      chapterId,
      content,
      position,
      resolved: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    sendMessage({ type: 'comment', comment });
    update((s) => ({ ...s, comments: [...s.comments, comment] }));
  }

  function replyToComment(commentId: string, content: string) {
    const reply: CommentReply = {
      id: `reply-${Date.now()}`,
      userId,
      content,
      createdAt: new Date().toISOString(),
    };
    sendMessage({ type: 'comment-reply', commentId, reply });
    update((s) => ({
      ...s,
      comments: s.comments.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
      ),
    }));
  }

  function resolveComment(commentId: string) {
    update((s) => ({
      ...s,
      comments: s.comments.map((c) =>
        c.id === commentId ? { ...c, resolved: true } : c
      ),
    }));
  }

  function deleteComment(commentId: string) {
    update((s) => ({
      ...s,
      comments: s.comments.filter((c) => c.id !== commentId),
    }));
  }

  function createVersionSnapshot(name: string, description: string, settings: BookSettings) {
    const snapshot: VersionSnapshot = {
      id: `v-${Date.now()}`,
      name,
      description,
      settings,
      createdBy: userName,
      createdAt: new Date().toISOString(),
      size: JSON.stringify(settings).length,
    };
    sendMessage({ type: 'version-snapshot', snapshot });
    update((s) => ({ ...s, versions: [snapshot, ...s.versions] }));
  }

  function sendPresence() {
    sendMessage({ type: 'presence', userId });
  }

  // Periodic presence
  let presenceInterval: ReturnType<typeof setInterval> | null = null;

  function startPresence() {
    presenceInterval = setInterval(sendPresence, 30000);
  }

  function stopPresence() {
    if (presenceInterval) {
      clearInterval(presenceInterval);
      presenceInterval = null;
    }
  }

  return {
    subscribe,
    connect,
    disconnect,
    updateCursor,
    broadcastChange,
    addComment,
    replyToComment,
    resolveComment,
    deleteComment,
    createVersionSnapshot,
    startPresence,
    stopPresence,
    get userId() { return userId; },
    get userName() { return userName; },
  };
}

export const collaboration = createCollaborationStore();

// Derived stores
export const connected = derived(collaboration, ($s) => $s.connected);
export const onlineUsers = derived(collaboration, ($s) => $s.users);
export const activeCursors = derived(collaboration, ($s) => $s.cursors);
export const allComments = derived(collaboration, ($s) => $s.comments);
export const allVersions = derived(collaboration, ($s) => $s.versions);
export const pendingChanges = derived(collaboration, ($s) => $s.pendingChanges);
