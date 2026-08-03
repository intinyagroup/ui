// ============================================
// Tracked Changes utilities — track insertions/deletions
// ============================================

export type TrackedChange = {
  id: string;
  type: 'insertion' | 'deletion';
  userId: string;
  userName: string;
  timestamp: string;
  content: string;
  accepted: boolean;
};

export type TrackedChangeState = {
  enabled: boolean;
  changes: TrackedChange[];
  currentUserId: string;
  currentUserName: string;
};

export function createTrackedChangeState(userId: string, userName: string): TrackedChangeState {
  return {
    enabled: false,
    changes: [],
    currentUserId: userId,
    currentUserName: userName,
  };
}

export function addTrackedChange(
  state: TrackedChangeState,
  type: 'insertion' | 'deletion',
  content: string
): TrackedChange {
  const change: TrackedChange = {
    id: `tc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    userId: state.currentUserId,
    userName: state.currentUserName,
    timestamp: new Date().toISOString(),
    content,
    accepted: false,
  };
  return change;
}

export function acceptChange(state: TrackedChangeState, changeId: string): TrackedChangeState {
  return {
    ...state,
    changes: state.changes.map((c) =>
      c.id === changeId ? { ...c, accepted: true } : c
    ),
  };
}

export function rejectChange(state: TrackedChangeState, changeId: string): TrackedChangeState {
  return {
    ...state,
    changes: state.changes.filter((c) => c.id !== changeId),
  };
}

export function acceptAllChanges(state: TrackedChangeState): TrackedChangeState {
  return {
    ...state,
    changes: state.changes.map((c) => ({ ...c, accepted: true })),
  };
}

export function rejectAllChanges(state: TrackedChangeState): TrackedChangeState {
  return {
    ...state,
    changes: [],
  };
}

export function getPendingChangesCount(state: TrackedChangeState): number {
  return state.changes.filter((c) => !c.accepted).length;
}

export function getChangesByUser(state: TrackedChangeState, userId: string): TrackedChange[] {
  return state.changes.filter((c) => c.userId === userId);
}

/**
 * Render tracked changes as HTML with colored marks
 */
export function renderTrackedChanges(html: string, changes: TrackedChange[]): string {
  let result = html;

  for (const change of changes) {
    if (change.accepted) continue;

    if (change.type === 'insertion') {
      // Mark insertions with green background
      result = result.replace(
        change.content,
        `<span class="tracked-insertion" data-change-id="${change.id}" style="background: #dcfce7; text-decoration: none;">${change.content}</span>`
      );
    } else if (change.type === 'deletion') {
      // Mark deletions with red strikethrough
      result = result.replace(
        change.content,
        `<span class="tracked-deletion" data-change-id="${change.id}" style="background: #fee2e2; text-decoration: line-through; color: #991b1b;">${change.content}</span>`
      );
    }
  }

  return result;
}

/**
 * Extract tracked changes from HTML
 */
export function extractTrackedChanges(html: string): TrackedChange[] {
  const changes: TrackedChange[] = [];

  // Extract insertions
  const insertionRegex = /<span[^>]*class="tracked-insertion"[^>]*data-change-id="([^"]*)"[^>]*>(.*?)<\/span>/gi;
  let match;
  while ((match = insertionRegex.exec(html)) !== null) {
    changes.push({
      id: match[1],
      type: 'insertion',
      userId: 'unknown',
      userName: 'Unknown',
      timestamp: new Date().toISOString(),
      content: match[2],
      accepted: false,
    });
  }

  // Extract deletions
  const deletionRegex = /<span[^>]*class="tracked-deletion"[^>]*data-change-id="([^"]*)"[^>]*>(.*?)<\/span>/gi;
  while ((match = deletionRegex.exec(html)) !== null) {
    changes.push({
      id: match[1],
      type: 'deletion',
      userId: 'unknown',
      userName: 'Unknown',
      timestamp: new Date().toISOString(),
      content: match[2],
      accepted: false,
    });
  }

  return changes;
}
