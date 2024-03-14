import { app, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';

let template: Array<MenuItemConstructorOptions | MenuItem> = [
  {
    label: '开森',
    role: 'editMenu',
    submenu: [
      {
        label: '嘻嘻',
        role: 'undo'
      },
      // {
      //   label: '重做',
      //   role: 'redo'
      // },
      // {
      //   type: 'separator'
      // },{
      //   label: '剪切',
      //   role: 'cut'
      // },
      {
        label: '复制',
        // accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }
      // {
      //   label: '粘贴',
      //   role: 'paste'
      // },
      // {
      //   label: '粘贴并匹配样式',
      //   role: 'pasteAndMatchStyle'
      // },
      // {
      //   label: '删除',
      //   role: 'delete'
      // },
      // {
      //   label: '全选',
      //   role: 'selectAll'
      // }
    ]
  },
  {
    label: '窗口',
    role: 'windowMenu',
    submenu: [
      // {
      //   label: '放大',
      //   role: 'zoomIn'
      // },
      // {
      //   label: '缩小',
      //   role: 'zoomOut'
      // },
      // {
      //   label: '默认',
      //   role: 'resetZoom'
      // },
      // {
      //   type: 'separator'
      // },
      {
        label: '重载',
        role: 'reload'
      },
      {
        label: '强制重载',
        role: 'forceReload'
      },
      {
        label: '开发者工具',
        role: 'toggleDevTools'
      },
      {
        type: 'separator'
      },
      {
        label: '关闭',
        role: 'close'
      },
      {
        label: '退出',
        role: 'quit'
      }
    ]
  }
];

if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: `关于 ${name}`,
        role: 'about',
        accelerator: ''
      },
      {
        type: 'separator'
      },
      {
        label: '服务',
        role: 'services',
        accelerator: ''
      },
      {
        type: 'separator'
      },
      {
        label: `隐藏 ${name}`,
        role: 'hide'
      },
      {
        label: '隐藏其它',
        role: 'hideOthers'
      },
      {
        label: '显示全部',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        role: 'quit'
      }
    ]
  });
}
export default (win?: BrowserWindow): void => {
  console.log('🚀::::::🐶💩', win);
  // app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  // });
};
