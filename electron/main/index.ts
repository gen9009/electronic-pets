import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import remote from '@electron/remote/main';
import process from 'node:process';
import registerModule from './modules';


process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
remote.initialize();
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    frame: false,
    width: 220, //默认宽度
    height: 220, //默认高度
    transparent: true, // 导航栏透明
    // minWidth: 780, //最小宽度
    // minHeight: 400, //最小高度
    resizable: true, // 缩放
    // titleBarStyle: 'hidden',
    alwaysOnTop: true, // 窗口始终位于顶部
    hasShadow:false,
    titleBarOverlay: {
      height: 30
    },
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false, //窗口节流
      experimentalFeatures: true,
      // devTools:false
    }
  });
  // 获取屏幕的宽度和高度
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  // 设置窗口的初始位置为屏幕左下角
  win.setPosition(0, height - win.getSize()[1]);
  remote.enable(win.webContents);
  // 在窗口上调用 setIgnoreMouseEvents 方法，使其忽略鼠标事件
  // win.setIgnoreMouseEvents(true)
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
  registerModule(win);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
