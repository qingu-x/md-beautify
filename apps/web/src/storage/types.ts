export type StorageType = "indexeddb" | "filesystem";

export interface FileItem {
  path: string;
  name: string;
  size?: number;
  updatedAt?: string;
  meta?: Record<string, unknown>;
  isDirectory?: boolean;
  children?: FileItem[];
  level?: number;
  parentPath?: string;
}

export interface StorageInitResult {
  ready: boolean;
  message?: string;
}

export interface StorageAdapterContext {
  /**
   * Optional metadata for adapters that require handles or tokens.
   */
  identifier?: string;
}
