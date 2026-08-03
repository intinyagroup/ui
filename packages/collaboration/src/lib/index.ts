// ============================================
// @intinyagroup/collaboration — Real-time + Version History
// ============================================

// Components
export { default as CollaborationPanel } from './components/CollaborationPanel.svelte';
export { default as VersionHistory } from './components/VersionHistory.svelte';
export { default as PresenceIndicator } from './components/PresenceIndicator.svelte';

// Stores
export {
  collaboration,
  connected,
  onlineUsers,
  activeCursors,
  allComments,
  allVersions,
  pendingChanges,
  type User,
  type CursorPosition,
  type Change,
  type Comment,
  type CommentReply,
  type CollaborationState,
} from './stores/collaboration-store.js';

export {
  versionHistory,
  versions,
  currentVersions,
  autoSavedVersions,
  type VersionEntry,
  type VersionDiff,
  type VersionHistoryState,
} from './stores/version-history-store.js';
