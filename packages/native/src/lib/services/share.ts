import { Share } from '@capacitor/share';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: string[];
}

/**
 * Share content with the native share sheet (native) or the Web Share API.
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  try {
    await Share.share({
      title: options.title,
      text: options.text,
      url: options.url,
      files: options.files
    });
    return true;
  } catch {
    // user cancelled or plugin unavailable — fall through
  }

  const w = globalThis as { navigator?: Navigator & { share?: (o: ShareOptions) => Promise<void> } };
  if (w.navigator?.share) {
    try {
      await w.navigator.share(options);
      return true;
    } catch {
      return false;
    }
  }

  throw new Error('Sharing is not supported in this environment');
}