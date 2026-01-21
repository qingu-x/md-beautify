import type { StorageAdapter } from "../StorageAdapter";
import type {
  FileItem,
  StorageAdapterContext,
  StorageInitResult,
} from "../types";

export class FileSystemAdapter implements StorageAdapter {
  readonly type = "filesystem" as const;
  readonly name = "FileSystem Access";
  ready = false;
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private handleKey = "fs-handle";

  async init(context?: StorageAdapterContext): Promise<StorageInitResult> {
    if (!("showDirectoryPicker" in window)) {
      return { ready: false, message: "File System Access API not supported" };
    }

    if (context?.identifier) {
      this.handleKey = `fs-handle-${context.identifier}`;
    }

    if (context?.identifier && !this.directoryHandle) {
      this.directoryHandle = await this.restoreHandle().catch(() => null);
    }

    if (!this.directoryHandle) {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });
      await this.persistHandle(this.directoryHandle);
    }

    const permission = await this.directoryHandle.requestPermission({
      mode: "readwrite",
    });
    this.ready = permission === "granted";
    return { ready: this.ready, message: permission };
  }

  private async persistHandle(handle: FileSystemDirectoryHandle) {
    try {
      const db = await this.openHandleDb();
      const tx = db.transaction("handles", "readwrite");
      await tx.store.put(handle, this.handleKey);
      await tx.done;
    } catch {
      /* ignore */
    }
  }

  private async restoreHandle(): Promise<FileSystemDirectoryHandle | null> {
    const db = await this.openHandleDb();
    const tx = db.transaction("handles", "readonly");
    const handle = await tx.store.get(this.handleKey);
    await tx.done;
    return handle ?? null;
  }

  private async openHandleDb() {
    const { openDB } = await import("idb");
    return openDB("wemd-fs-handles", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("handles")) {
          db.createObjectStore("handles");
        }
      },
    });
  }

  private ensureHandle() {
    if (!this.directoryHandle)
      throw new Error("Directory handle not initialized");
    return this.directoryHandle;
  }

  /**
   * 递归扫描文件夹，获取文件元数据
   */
  private async scanDirectory(
    handle: FileSystemDirectoryHandle,
    basePath: string = "",
    level: number = 0,
  ): Promise<FileItem[]> {
    const directories: FileItem[] = [];
    const files: FileItem[] = [];

    for await (const entry of handle.values()) {
      if (entry.name.startsWith(".")) continue;

      const fullPath = basePath ? `${basePath}/${entry.name}` : entry.name;

      if (entry.kind === "directory") {
        const dirHandle = entry as FileSystemDirectoryHandle;
        const children = await this.scanDirectory(
          dirHandle,
          fullPath,
          level + 1,
        );

        if (children.length > 0) {
          directories.push({
            path: fullPath,
            name: entry.name,
            size: 0,
            updatedAt: new Date().toISOString(),
            isDirectory: true,
            children,
            level,
            parentPath: basePath,
          });
        }
      } else if (entry.name.endsWith(".md")) {
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();

        // 读取文件开头 500 字节提取 themeName
        let themeName: string | undefined;
        try {
          const slice = file.slice(0, 500);
          const text = await slice.text();
          const match = text.match(/^---\n([\s\S]*?)\n---/);
          if (match) {
            const themeMatch = match[1].match(/themeName:\s*(.+)/);
            if (themeMatch) {
              themeName = themeMatch[1].trim().replace(/^['"]|['"]$/g, "");
            }
          }
        } catch {
          // ignore
        }

        files.push({
          path: fullPath,
          name: entry.name,
          size: file.size,
          updatedAt: file.lastModified
            ? new Date(file.lastModified).toISOString()
            : undefined,
          isDirectory: false,
          level,
          parentPath: basePath,
          meta: themeName ? { themeName } : undefined,
        });
      }
    }

    // 文件夹按名称排序，文件按更新时间降序
    directories.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });

    return [...directories, ...files];
  }

  /**
   * 获取文件元数据，读取文件头部提取 themeName
   */
  async listFiles(): Promise<FileItem[]> {
    const handle = this.ensureHandle();
    return this.scanDirectory(handle);
  }

  private async getHandleByPath(
    path: string,
  ): Promise<FileSystemFileHandle | FileSystemDirectoryHandle> {
    const parts = path.split("/");
    let currentHandle: FileSystemDirectoryHandle | FileSystemFileHandle =
      this.ensureHandle();

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // 最后一部分是文件
        return await (currentHandle as FileSystemDirectoryHandle).getFileHandle(
          part,
        );
      } else {
        // 中间部分是文件夹
        currentHandle = await (
          currentHandle as FileSystemDirectoryHandle
        ).getDirectoryHandle(part);
      }
    }
    return currentHandle;
  }

  async readFile(path: string): Promise<string> {
    const fileHandle = (await this.getHandleByPath(
      path,
    )) as FileSystemFileHandle;
    const file = await fileHandle.getFile();
    return file.text();
  }

  async writeFile(path: string, content: string): Promise<void> {
    const parts = path.split("/");
    let currentHandle: FileSystemDirectoryHandle = this.ensureHandle();

    // 创建必要的文件夹
    for (let i = 0; i < parts.length - 1; i++) {
      currentHandle = await currentHandle.getDirectoryHandle(parts[i], {
        create: true,
      });
    }

    const fileName = parts[parts.length - 1];
    const fileHandle = await currentHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async deleteFile(path: string): Promise<void> {
    const parts = path.split("/");
    if (parts.length === 1) {
      await this.ensureHandle().removeEntry(path);
    } else {
      let currentHandle: FileSystemDirectoryHandle = this.ensureHandle();
      for (let i = 0; i < parts.length - 1; i++) {
        currentHandle = await currentHandle.getDirectoryHandle(parts[i]);
      }
      await currentHandle.removeEntry(parts[parts.length - 1]);
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    if (oldPath === newPath) return;
    const content = await this.readFile(oldPath);
    await this.writeFile(newPath, content);
    await this.deleteFile(oldPath);
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.getHandleByPath(path);
      return true;
    } catch {
      return false;
    }
  }

  async teardown() {
    this.directoryHandle = null;
    this.ready = false;
  }
}
