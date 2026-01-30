import { app, BrowserWindow, Menu, dialog, ipcMain, nativeImage, IpcMainInvokeEvent, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { checkForUpdates, openReleasesPage } from './updater';

// --- Internationalization Support / 国际化支持 ---
const translations = {
    zh: {
        exportHtml: '导出 HTML',
        exportPdf: '导出 PDF',
        selectWorkspace: '选择 MD Beautify 工作区文件夹',
        about: '关于 MD Beautify',
        hide: '隐藏 MD Beautify',
        hideOthers: '隐藏其他',
        showAll: '显示全部',
        quit: '退出 MD Beautify',
        file: '文件',
        newArticle: '新建文章',
        save: '保存',
        switchWorkspace: '切换工作区...',
        edit: '编辑',
        undo: '撤销',
        redo: '重做',
        cut: '剪切',
        copy: '复制',
        paste: '粘贴',
        selectAll: '全选',
        view: '查看',
        reload: '重新加载',
        forceReload: '强制重新加载',
        toggleDevTools: '开发者工具',
        resetZoom: '实际大小',
        zoomIn: '放大',
        zoomOut: '缩小',
        toggleFullscreen: '全屏',
        window: '窗口',
        minimize: '最小化',
        zoom: '缩放',
        front: '前置全部窗口',
        help: '帮助',
        checkForUpdates: '检查更新...',
        visitWebsite: '访问官网',
        githubRepo: 'GitHub 仓库',
        fileExisted: '文件名已存在',
        cannotReadDir: '无法将文件夹作为文件读取',
        noWorkspace: '未选择工作区',
        filePathRequired: '需要文件路径',
        invalidArgs: '参数无效',
        defaultTheme: '默认主题',
        untitled: '未命名文章',
    },
    en: {
        exportHtml: 'Export HTML',
        exportPdf: 'Export PDF',
        selectWorkspace: 'Select MD Beautify Workspace Folder',
        about: 'About MD Beautify',
        hide: 'Hide MD Beautify',
        hideOthers: 'Hide Others',
        showAll: 'Show All',
        quit: 'Quit MD Beautify',
        file: 'File',
        newArticle: 'New Article',
        save: 'Save',
        switchWorkspace: 'Switch Workspace...',
        edit: 'Edit',
        undo: 'Undo',
        redo: 'Redo',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        selectAll: 'Select All',
        view: 'View',
        reload: 'Reload',
        forceReload: 'Force Reload',
        toggleDevTools: 'Developer Tools',
        resetZoom: 'Actual Size',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        toggleFullscreen: 'Toggle Full Screen',
        window: 'Window',
        minimize: 'Minimize',
        zoom: 'Zoom',
        front: 'Bring All to Front',
        help: 'Help',
        checkForUpdates: 'Check for Updates...',
        visitWebsite: 'Visit Website',
        githubRepo: 'GitHub Repository',
        fileExisted: 'File already exists',
        cannotReadDir: 'Cannot read directory as file',
        noWorkspace: 'No workspace selected',
        filePathRequired: 'File path required',
        invalidArgs: 'Invalid arguments',
        defaultTheme: 'Default Theme',
        untitled: 'Untitled Article',
    }
};

// 获取当前语言 (默认为中文)
const getLocale = () => {
    try {
        return app.getLocale().startsWith('zh') ? 'zh' : 'en';
    } catch (e) {
        return 'zh';
    }
};

const t = (key: keyof typeof translations['zh']) => {
    const locale = getLocale();
    return translations[locale][key] || key;
};

// 判断是否为开发模式 - 使用 app.isPackaged 是最可靠的方式
// 注意：app.isPackaged 只能在 app ready 之后使用，这里用延迟判断
let isDev = !app.isPackaged || process.argv.includes('--dev') || !!process.env.ELECTRON_START_URL;

app.setName('MD Beautify');
app.setAppUserModelId('com.mdb.app');

interface FileEntry {
    name: string;
    path: string;
    isDirectory: boolean;
    createdAt: Date;
    updatedAt: Date;
    size: number;
    themeName?: string;
    children?: FileEntry[];
    level?: number;
    parentPath?: string;
}

let mainWindow: BrowserWindow | null = null;
let workspaceDir: string | null = null;
let fileWatcher: fs.FSWatcher | null = null;
let watcherDebounceTimer: NodeJS.Timeout | null = null;

// --- 文件监听器 ---
function startWatching(dir: string) {
    if (fileWatcher) {
        fileWatcher.close();
        fileWatcher = null;
    }
    if (!dir || !fs.existsSync(dir)) return;

    try {
        fileWatcher = fs.watch(dir, { recursive: false }, (_eventType, filename) => {
            if (!filename) return;
            // 忽略隐藏文件和非 md 文件
            if (filename.startsWith('.') || !filename.endsWith('.md')) return;

            // 防抖发送更新事件
            if (watcherDebounceTimer) clearTimeout(watcherDebounceTimer);
            watcherDebounceTimer = setTimeout(() => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('file:refresh');
                }
            }, 300); // 300ms 防抖
        });
    } catch (error) {
        console.error('Failed to watch directory:', error);
    }
}

function stopWatching() {
    if (fileWatcher) {
        fileWatcher.close();
        fileWatcher = null;
    }
}

// --- 辅助函数 ---

function getWindowIcon() {


    // 方案 1: 当前脚本同级 assets 目录
    let iconPath = path.join(__dirname, 'assets', 'icon.png');

    // 方案 2: 父级 assets 目录 (dist 场景)
    if (!fs.existsSync(iconPath)) {
        iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
    }

    // 方案 3: 绝对开发路径回退 (开发环境可选)
    // omit for now.

    const img = nativeImage.createFromPath(iconPath);
    return img.isEmpty() ? null : img;
}

function getUniqueFilePath(dir: string, filename: string): string {
    const parsed = path.parse(filename);
    const base = parsed.name;
    const ext = parsed.ext || '.md';
    let candidate = path.join(dir, `${base}${ext}`);
    let counter = 1;
    while (fs.existsSync(candidate)) {
        candidate = path.join(dir, `${base} (${counter})${ext}`);
        counter += 1;
    }
    return candidate;
}


function scanWorkspace(dir: string, level: number = 0, parentPath: string = ''): FileEntry[] {
    if (!dir || !fs.existsSync(dir)) return [];
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const results: FileEntry[] = [];

        // 分别处理文件夹和文件
        const directories = entries.filter(entry => 
            entry.isDirectory() && 
            !entry.name.startsWith('.') && 
            entry.name !== 'node_modules'
        );
        
        const files = entries.filter(entry => 
            entry.isFile() && 
            entry.name.endsWith('.md') && 
            !entry.name.startsWith('.')
        );

        // 处理文件夹
        for (const dirEntry of directories) {
            const fullPath = path.join(dir, dirEntry.name);
            const stats = fs.statSync(fullPath);
            const children = scanWorkspace(fullPath, level + 1, fullPath);
            
            results.push({
                name: dirEntry.name,
                path: fullPath,
                isDirectory: true,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime,
                size: 0,
                children,
                level,
                parentPath
            });
        }

        // 处理文件
        for (const fileEntry of files) {
            const fullPath = path.join(dir, fileEntry.name);
                const stats = fs.statSync(fullPath);

                // 尝试读取 Frontmatter 获取 themeName
                let themeName = t('defaultTheme');
                try {
                    const fd = fs.openSync(fullPath, 'r');
                const buffer = Buffer.alloc(500);
                    const bytesRead = fs.readSync(fd, buffer, 0, 500, 0);
                    fs.closeSync(fd);

                    const content = buffer.toString('utf8', 0, bytesRead);
                    const match = content.match(/^---\n([\s\S]*?)\n---/);
                    if (match) {
                        const frontmatter = match[1];
                        const themeMatch = frontmatter.match(/themeName:\s*(.+)/);
                        if (themeMatch) {
                            themeName = themeMatch[1].trim().replace(/^['"]|['"]$/g, '');
                        }
                    }
                } catch (e) {
                    // 忽略读取错误
                }

            results.push({
                name: fileEntry.name,
                    path: fullPath,
                    isDirectory: false,
                    createdAt: stats.birthtime,
                    updatedAt: stats.mtime,
                    size: stats.size,
                themeName,
                level,
                parentPath
            });
        }

        // 文件夹按名称排序，文件按更新时间降序
        const sortedDirs = results.filter(r => r.isDirectory).sort((a, b) => a.name.localeCompare(b.name));
        const sortedFiles = results.filter(r => !r.isDirectory).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        
        return [...sortedDirs, ...sortedFiles];
    } catch (error) {
        console.error('Scan workspace failed:', error);
        return [];
    }
}

// --- 窗口管理 ---

function createWindow() {
    const windowIcon = getWindowIcon() || undefined;
    const isWindows = process.platform === 'win32';

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1024,
        minHeight: 640,
        title: 'MD Beautify',
        icon: windowIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
        },
        titleBarStyle: 'hidden',
        frame: !isWindows, // Windows 完全无边框
        titleBarOverlay: isWindows ? false : {
            color: '#f5f7f9',
            symbolColor: '#2c2c2c',
            height: 48,
        },
        trafficLightPosition: { x: 34, y: 45 },
    });

    const startUrl = process.env.ELECTRON_START_URL
        ? process.env.ELECTRON_START_URL
        : isDev
            ? 'http://localhost:5173'
            : `file://${path.join(process.resourcesPath, 'web-dist', 'index.html')}`;

    console.log('[MDBeautify] Loading URL:', startUrl);
    console.log('[MDBeautify] isDev:', isDev);
    console.log('[MDBeautify] resourcesPath:', process.resourcesPath);

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    isDev
                        ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http://localhost:* ws://localhost:*; img-src 'self' data: blob: https:; connect-src 'self' https: http://localhost:* ws://localhost:*"
                        : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:"
                ]
            }
        });
    });

    mainWindow.loadURL(startUrl);
    
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (url !== startUrl && (url.startsWith('http://') || url.startsWith('https://'))) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });
    
    mainWindow.on('closed', () => {
        mainWindow = null;
        stopWatching();
    });
}

// --- IPC 处理器 ---

// 窗口控制 (用于 Windows 自定义标题栏)
ipcMain.handle('window:minimize', () => mainWindow?.minimize());
ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize();
    else mainWindow?.maximize();
});
ipcMain.handle('window:close', () => mainWindow?.close());
ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized());

// 导出管理
ipcMain.handle('export:html', async (_event, { content, title }) => {
    if (!mainWindow) return;
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
        title: t('exportHtml'),
        defaultPath: `${title || 'export'}.html`,
        filters: [{ name: 'HTML Files', extensions: ['html'] }]
    });

    if (filePath) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
});

ipcMain.handle('export:pdf', async (_event, { content, title }) => {
    if (!mainWindow) {
        console.error('[Export PDF] Main window not available');
        return false;
    }

    const printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    let tmpPath: string | null = null;
    
    try {
        tmpPath = path.join(app.getPath('temp'), `mdb-export-${Date.now()}.html`);
        fs.writeFileSync(tmpPath, content, 'utf-8');
        
        await printWindow.loadFile(tmpPath);
        
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Resource loading timeout'));
            }, 30000);
            
            printWindow.webContents.executeJavaScript(`
                (async () => {
                    // 等待所有外部样式表加载完成（包括 KaTeX CSS）
                    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
                    await Promise.all(links.map(link => {
                        if (link.sheet) return Promise.resolve();
                        return new Promise((resolve) => {
                            link.addEventListener('load', () => resolve());
                            link.addEventListener('error', () => resolve());
                            setTimeout(() => resolve(), 5000);
                        });
                    }));
                    
                    // 等待字体加载（KaTeX 使用自定义字体）
                    await document.fonts.ready;
                    
                    // 等待图片加载
                    const images = Array.from(document.images);
                    await Promise.all(images.map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise((resolve) => {
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                            setTimeout(() => resolve(), 3000);
                        });
                    }));
                    
                    // 额外等待，确保 KaTeX 渲染完成
                    await new Promise(r => setTimeout(r, 1500));
                })();
            `).then(() => {
                clearTimeout(timeout);
                resolve();
            }).catch((err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
        
        const data = await printWindow.webContents.printToPDF({
            printBackground: true,
            margins: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            pageSize: 'A4',
            preferCSSPageSize: true
        });

        const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
            title: t('exportPdf'),
            defaultPath: `${title || 'export'}.pdf`,
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (canceled || !filePath) {
            return false;
        }

        fs.writeFileSync(filePath, data);
        return true;
    } catch (error) {
        console.error('[Export PDF] Error:', error);
        throw error;
    } finally {
        printWindow.close();
        if (tmpPath && fs.existsSync(tmpPath)) {
            try {
                fs.unlinkSync(tmpPath);
            } catch (err) {
                console.error('[Export PDF] Failed to clean up temp file:', err);
            }
        }
    }
});

// 工作区管理
ipcMain.handle('workspace:select', async () => {
    if (!mainWindow) return { success: false, error: 'Window not initialized' };
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory'],
        message: t('selectWorkspace')
    });
    if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
    }
    const dir = result.filePaths[0];
    workspaceDir = dir;
    startWatching(dir);
    return { success: true, path: dir };
});

ipcMain.handle('workspace:current', async () => {
    // 这里可以结合 electron-store 持久化，暂时由前端传过来校验
    return { success: true, path: workspaceDir };
});

ipcMain.handle('workspace:set', async (_event: IpcMainInvokeEvent, dir: string) => {
    if (!dir || !fs.existsSync(dir)) {
        return { success: false, error: 'Directory not found' };
    }
    workspaceDir = dir;
    startWatching(dir);
    return { success: true, path: dir };
});

ipcMain.handle('file:list', async (_event: IpcMainInvokeEvent, dir?: string) => {
    const targetDir = dir || workspaceDir;
    if (!targetDir) return { success: false, error: 'No workspace selected' };
    const files = scanWorkspace(targetDir);
    return { success: true, files };
});

ipcMain.handle('file:read', async (_event: IpcMainInvokeEvent, filePath: string) => {
    try {
        if (!fs.existsSync(filePath)) {
            return { success: false, error: 'File not found' };
        }
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            return { success: false, error: t('cannotReadDir') };
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return { success: true, content, filePath };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('file:create', async (_event: IpcMainInvokeEvent, payload: { filename?: string; content?: string }) => {
    if (!workspaceDir) return { success: false, error: t('noWorkspace') };
    const { filename, content } = payload || {};
    const safeName = filename ? filename.trim() : `${t('untitled')}.md`;

    try {
        // 检查文件名是否包含子目录
        if (safeName.includes('/') || safeName.includes(path.sep)) {
            // 包含子目录，直接使用路径并确保目录存在
            const targetPath = path.join(workspaceDir, safeName);
            const targetDir = path.dirname(targetPath);
            
            // 确保目录存在
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            fs.writeFileSync(targetPath, content || '', 'utf-8');
            return { success: true, filePath: targetPath, filename: path.basename(targetPath) };
        } else {
            // 不包含子目录，使用原有逻辑处理重名
            const targetPath = getUniqueFilePath(workspaceDir, safeName);
            fs.writeFileSync(targetPath, content || '', 'utf-8');
            return { success: true, filePath: targetPath, filename: path.basename(targetPath) };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('file:save', async (_event: IpcMainInvokeEvent, payload: { filePath: string; content: string }) => {
    const { filePath, content } = payload;
    if (!filePath) return { success: false, error: t('filePathRequired') };

    try {
        // 检查内容是否变更，避免不必要的写入
        let existingContent = '';
        if (fs.existsSync(filePath)) {
            existingContent = fs.readFileSync(filePath, 'utf-8');
        }

        // 仅当内容不同才写入
        if (existingContent !== content) {
            fs.writeFileSync(filePath, content, 'utf-8');
        }

        return { success: true, filePath };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('file:rename', async (_event: IpcMainInvokeEvent, payload: { oldPath: string; newPath: string }) => {
    const { oldPath, newPath } = payload;
    if (!oldPath || !newPath) return { success: false, error: t('invalidArgs') };

    if (oldPath === newPath) return { success: true, filePath: newPath };

    // 检查目标是否存在 (且不是大小写变名)
    if (fs.existsSync(newPath) && oldPath.toLowerCase() !== newPath.toLowerCase()) {
        return { success: false, error: t('fileExisted') };
    }

    try {
        // 确保目标目录存在
        const targetDir = path.dirname(newPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.renameSync(oldPath, newPath);
        return { success: true, filePath: newPath };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('file:delete', async (_event: IpcMainInvokeEvent, filePath: string) => {
    if (!filePath) return { success: false, error: 'Path required' };
    try {
        if (fs.existsSync(filePath)) {
            // 尝试移动到回收站
            await shell.trashItem(filePath);
        }
        return { success: true };
    } catch (error) {
        // 如果回收站失败，尝试物理删除
        try {
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(filePath);
                }
            }
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }
});

ipcMain.handle('file:reveal', async (_event: IpcMainInvokeEvent, filePath: string) => {
    if (filePath) {
        shell.showItemInFolder(filePath);
    }
});

// 更新相关
ipcMain.handle('update:openReleases', () => {
    openReleasesPage();
});


// 创建应用菜单
function createMenu() {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'MD Beautify',
            submenu: [
                { role: 'about', label: t('about') },
                { type: 'separator' },
                { role: 'hide', label: t('hide') },
                { role: 'hideOthers', label: t('hideOthers') },
                { role: 'unhide', label: t('showAll') },
                { type: 'separator' },
                { role: 'quit', label: t('quit') },
            ],
        },
        {
            label: t('file'),
            submenu: [
                {
                    label: t('newArticle'),
                    accelerator: 'CmdOrCtrl+N',
                    click: () => mainWindow && mainWindow.webContents.send('menu:new-file')
                },
                { type: 'separator' },
                {
                    label: t('save'),
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow && mainWindow.webContents.send('menu:save')
                },
                { type: 'separator' },
                {
                    label: t('switchWorkspace'),
                    click: async () => {
                        mainWindow && mainWindow.webContents.send('menu:switch-workspace');
                    }
                }
            ],
        },
        {
            label: t('edit'),
            submenu: [
                { role: 'undo', label: t('undo') },
                { role: 'redo', label: t('redo') },
                { type: 'separator' },
                { role: 'cut', label: t('cut') },
                { role: 'copy', label: t('copy') },
                { role: 'paste', label: t('paste') },
                { role: 'selectAll', label: t('selectAll') },
            ],
        },
        {
            label: t('view'),
            submenu: [
                { role: 'reload', label: t('reload') },
                { role: 'forceReload', label: t('forceReload') },
                { role: 'toggleDevTools', label: t('toggleDevTools') },
                { type: 'separator' },
                { role: 'resetZoom', label: t('resetZoom') },
                { role: 'zoomIn', label: t('zoomIn') },
                { role: 'zoomOut', label: t('zoomOut') },
                { type: 'separator' },
                { role: 'togglefullscreen', label: t('toggleFullscreen') },
            ],
        },
        {
            label: t('window'),
            submenu: [
                { role: 'minimize', label: t('minimize') },
                { role: 'zoom', label: t('zoom') },
                { type: 'separator' },
                { role: 'front', label: t('front') },
            ],
        },
        {
            label: t('help'),
            submenu: [
                {
                    label: t('checkForUpdates'),
                    click: () => checkForUpdates(mainWindow, true),
                },
                { type: 'separator' },
                {
                    label: t('visitWebsite'),
                    click: () => shell.openExternal('https://mdb.app'),
                },
                {
                    label: t('githubRepo'),
                    click: () => shell.openExternal('https://github.com/qingu-x/md-beautify'),
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    // macOS 会自动使用 app bundle 中的 icon.icns 作为 dock 图标
    createWindow();
    createMenu();
    if (mainWindow) {
        mainWindow.maximize();
    }

    // 延迟 3 秒检查更新，避免阻塞启动
    setTimeout(() => {
        checkForUpdates(mainWindow);
    }, 3000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
