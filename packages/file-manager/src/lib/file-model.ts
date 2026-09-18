// ============================================
// @intinyagroup/file-manager — File Model & Core Utilities
// ============================================

export interface FilePermissions {
  read?: boolean;
  write?: boolean;
  delete?: boolean;
  download?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId?: string | null;
  size?: number; // Size in bytes
  updatedAt?: string | Date;
  mimeType?: string;
  extension?: string;
  url?: string;
  thumbnail?: string;
  permissions?: FilePermissions;
  [key: string]: unknown;
}

export type ViewMode = "grid" | "list";

export type SortField = "name" | "size" | "updatedAt" | "type";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export type FileCategory =
  | "folder"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "spreadsheet"
  | "code"
  | "archive"
  | "pdf"
  | "other";

export interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number; // 0 to 100
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

/**
 * Formats bytes to readable file size (e.g. 1.2 MB).
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "-";
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  const formatted =
    val < 10 && i > 0 ? Number(val.toFixed(1)) : Math.round(val);
  return `${formatted} ${sizes[i]}`;
}

/**
 * Extracts lowercase file extension without dot.
 */
export function getFileExtension(filename: string): string {
  if (!filename || !filename.includes(".")) return "";
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Detects the file category for icon mapping and preview types.
 */
export function getFileCategory(item: {
  type: "file" | "folder";
  name: string;
  mimeType?: string;
}): FileCategory {
  if (item.type === "folder") return "folder";

  const ext = getFileExtension(item.name);
  const mime = item.mimeType?.toLowerCase() ?? "";

  if (ext === "pdf" || mime.includes("pdf")) return "pdf";

  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"].includes(ext) ||
    mime.startsWith("image/")
  ) {
    return "image";
  }

  if (
    ["mp4", "webm", "mov", "avi", "mkv"].includes(ext) ||
    mime.startsWith("video/")
  ) {
    return "video";
  }

  if (
    ["mp3", "wav", "ogg", "flac", "m4a"].includes(ext) ||
    mime.startsWith("audio/")
  ) {
    return "audio";
  }

  if (
    ["xlsx", "xls", "csv", "tsv", "ods"].includes(ext) ||
    mime.includes("spreadsheet") ||
    mime.includes("excel")
  ) {
    return "spreadsheet";
  }

  if (
    ["doc", "docx", "txt", "rtf", "md", "odt"].includes(ext) ||
    mime.includes("document") ||
    mime.includes("word") ||
    mime.startsWith("text/")
  ) {
    return "document";
  }

  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "css",
      "json",
      "py",
      "go",
      "rs",
      "java",
      "cpp",
      "c",
      "sh",
      "yaml",
      "yml",
    ].includes(ext)
  ) {
    return "code";
  }

  if (["zip", "tar", "gz", "7z", "rar", "bz2", "xz"].includes(ext)) {
    return "archive";
  }

  return "other";
}

/**
 * Resolves path breadcrumbs starting from root to the specified folderId.
 */
export function buildBreadcrumbs(
  items: FileItem[],
  currentFolderId: string | null,
  rootName = "Home",
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ id: null, name: rootName }];
  if (!currentFolderId) return breadcrumbs;

  const itemMap = new Map<string, FileItem>(items.map((i) => [i.id, i]));
  const trail: BreadcrumbItem[] = [];

  let currId: string | null | undefined = currentFolderId;
  const visited = new Set<string>();

  while (currId && itemMap.has(currId) && !visited.has(currId)) {
    visited.add(currId);
    const folder = itemMap.get(currId)!;
    trail.unshift({ id: folder.id, name: folder.name });
    currId = folder.parentId;
  }

  return [...breadcrumbs, ...trail];
}

/**
 * Returns immediate children inside a folder.
 */
export function getChildrenInFolder(
  items: FileItem[],
  folderId: string | null,
): FileItem[] {
  const normTarget = folderId ? String(folderId) : null;
  return items.filter((item) => {
    const p = item.parentId ? String(item.parentId) : null;
    return p === normTarget;
  });
}

/**
 * Sorts file items with folders pinned at the top.
 */
export function sortFileItems(
  items: FileItem[],
  sort: SortConfig = { field: "name", direction: "asc" },
): FileItem[] {
  return [...items].sort((a, b) => {
    // Folders always come first
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;

    let comp = 0;
    switch (sort.field) {
      case "name":
        comp = a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        break;
      case "size": {
        const sizeA = a.size ?? 0;
        const sizeB = b.size ?? 0;
        comp = sizeA - sizeB;
        break;
      }
      case "updatedAt": {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        comp = timeA - timeB;
        break;
      }
      case "type":
        comp = (a.extension || a.type).localeCompare(b.extension || b.type);
        break;
    }

    return sort.direction === "asc" ? comp : -comp;
  });
}

/**
 * Filters items by name search query.
 */
export function filterFileItems(items: FileItem[], query: string): FileItem[] {
  if (!query.trim()) return items;
  const q = query.trim().toLowerCase();
  return items.filter((i) => i.name.toLowerCase().includes(q));
}
