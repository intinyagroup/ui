import { Preferences } from '@capacitor/preferences';

/**
 * Get a stored preference value.
 */
export async function getPreference(key: string): Promise<string | null> {
  const { value } = await Preferences.get({ key });
  return value ?? null;
}

/**
 * Store a preference value.
 */
export async function setPreference(key: string, value: string): Promise<void> {
  await Preferences.set({ key, value });
}

/**
 * Remove a preference value.
 */
export async function removePreference(key: string): Promise<void> {
  await Preferences.remove({ key });
}

/**
 * List all preference keys.
 */
export async function getPreferenceKeys(): Promise<string[]> {
  const { keys } = await Preferences.keys();
  return keys;
}

/**
 * Clear all preferences.
 */
export async function clearPreferences(): Promise<void> {
  await Preferences.clear();
}

/**
 * Convenience wrapper that parses/stores JSON with no throw.
 */
export async function getJSONPreference<T>(key: string, fallback: T): Promise<T> {
  const raw = await getPreference(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJSONPreference<T>(key: string, value: T): Promise<void> {
  await setPreference(key, JSON.stringify(value));
}