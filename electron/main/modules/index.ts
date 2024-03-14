import { BrowserWindow } from 'electron';
import ipcMain from './ipcMain';
import appMenu from './appMenu';
import appTray from './tray';
export default (win: BrowserWindow): void => {
  ipcMain(win);
  appMenu(win);
  appTray(win);
};
