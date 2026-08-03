// ============================================
// Version history store — snapshots, diff, restore
// ============================================

import { writable, derived, get } from 'svelte/store';
import type { BookSettings, Chapter } from '@intinyagroup/book-writer';

export type VersionEntry = {
  id: string;
  name: string;
  description: string;
  settings: BookSettings;
  createdBy: string;
  createdAt: string;
  size: number;
  autoSaved: boolean;
};

export type VersionDiff = {
  chaptersAdded: number;
  chaptersRemoved: number;
  chaptersModified: number;
  wordsAdded: number;
  wordsRemoved: number;
  totalChanges: number;
};

export type VersionHistoryState = {
  versions: VersionEntry[];
  currentVersionId: string | null;
  compareVersionId: string | null;
  autoSaveInterval: number;
  maxVersions: number;
};

const STORAGE_KEY = 'book-writer-versions';
const AUTO_SAVE_KEY = 'book-writer-autosave';

function createVersionHistoryStore() {
  const { subscribe, update, set } = writable<VersionHistoryState>({
    versions: [],
    currentVersionId: null,
    compareVersionId: null,
    autoSaveInterval: 300000, // 5 minutes
    maxVersions: 50,
  });

  let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  // Load from localStorage on init
  function init() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const versions = JSON.parse(saved);
        update((s) => ({ ...s, versions }));
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Save to localStorage
  function persist() {
    if (typeof window === 'undefined') return;
    try {
      const state = get({ subscribe });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.versions));
    } catch {
      // Ignore storage errors
    }
  }

  // Auto-save current version
  function autoSave(settings: BookSettings, createdBy: string) {
    const version: VersionEntry = {
      id: `autosave-${Date.now()}`,
      name: 'Auto-save',
      description: 'Automatic save',
      settings: JSON.parse(JSON.stringify(settings)), // Deep clone
      createdBy,
      createdAt: new Date().toISOString(),
      size: JSON.stringify(settings).length,
      autoSaved: true,
    };

    update((s) => {
      const versions = [version, ...s.versions.filter((v) => !v.autoSaved)].slice(0, s.maxVersions);
      return { ...s, versions };
    });
    persist();
  }

  // Create manual snapshot
  function createSnapshot(
    name: string,
    description: string,
    settings: BookSettings,
    createdBy: string
  ): VersionEntry {
    const version: VersionEntry = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      description,
      settings: JSON.parse(JSON.stringify(settings)),
      createdBy,
      createdAt: new Date().toISOString(),
      size: JSON.stringify(settings).length,
      autoSaved: false,
    };

    update((s) => {
      const versions = [version, ...s.versions].slice(0, s.maxVersions);
      return { ...s, versions };
    });
    persist();
    return version;
  }

  // Restore a version
  function restoreVersion(versionId: string): BookSettings | null {
    const state = get({ subscribe });
    const version = state.versions.find((v) => v.id === versionId);
    if (!version) return null;
    return JSON.parse(JSON.stringify(version.settings));
  }

  // Delete a version
  function deleteVersion(versionId: string) {
    update((s) => ({
      ...s,
      versions: s.versions.filter((v) => v.id !== versionId),
    }));
    persist();
  }

  // Compare two versions
  function compareVersions(versionAId: string, versionBId: string): VersionDiff {
    const state = get({ subscribe });
    const versionA = state.versions.find((v) => v.id === versionAId);
    const versionB = state.versions.find((v) => v.id === versionBId);

    if (!versionA || !versionB) {
      return { chaptersAdded: 0, chaptersRemoved: 0, chaptersModified: 0, wordsAdded: 0, wordsRemoved: 0, totalChanges: 0 };
    }

    const chaptersA = new Map(versionA.settings.chapters.map((ch) => [ch.id, ch]));
    const chaptersB = new Map(versionB.settings.chapters.map((ch) => [ch.id, ch]));

    let chaptersAdded = 0;
    let chaptersRemoved = 0;
    let chaptersModified = 0;
    let wordsAdded = 0;
    let wordsRemoved = 0;

    // Check for added/modified chapters
    for (const [id, chapterB] of chaptersB) {
      const chapterA = chaptersA.get(id);
      if (!chapterA) {
        chaptersAdded++;
        wordsAdded += getWordCount(chapterB.content);
      } else if (chapterA.content !== chapterB.content || chapterA.title !== chapterB.title) {
        chaptersModified++;
        const wordsA = getWordCount(chapterA.content);
        const wordsB = getWordCount(chapterB.content);
        if (wordsB > wordsA) wordsAdded += wordsB - wordsA;
        else wordsRemoved += wordsA - wordsB;
      }
    }

    // Check for removed chapters
    for (const [id] of chaptersA) {
      if (!chaptersB.has(id)) {
        chaptersRemoved++;
        wordsRemoved += getWordCount(chaptersA.get(id)!.content);
      }
    }

    return {
      chaptersAdded,
      chaptersRemoved,
      chaptersModified,
      wordsAdded,
      wordsRemoved,
      totalChanges: chaptersAdded + chaptersRemoved + chaptersModified,
    };
  }

  // Start auto-save
  function startAutoSave(settingsGetter: () => BookSettings, createdBy: string) {
    stopAutoSave();
    const state = get({ subscribe });
    autoSaveTimer = setInterval(() => {
      const settings = settingsGetter();
      autoSave(settings, createdBy);
    }, state.autoSaveInterval);
  }

  // Stop auto-save
  function stopAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  function getWordCount(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
  }

  function setCompareVersion(versionId: string | null) {
    update((s) => ({ ...s, compareVersionId: versionId }));
  }

  // Initialize
  init();

  return {
    subscribe,
    createSnapshot,
    restoreVersion,
    deleteVersion,
    compareVersions,
    startAutoSave,
    stopAutoSave,
    setCompareVersion,
  };
}

export const versionHistory = createVersionHistoryStore();
export const versions = derived(versionHistory, ($s) => $s.versions);
export const currentVersions = derived(versionHistory, ($s) => $s.versions.filter((v) => !v.autoSaved));
export const autoSavedVersions = derived(versionHistory, ($s) => $s.versions.filter((v) => v.autoSaved));
