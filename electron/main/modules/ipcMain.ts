import { BrowserWindow, ipcMain } from 'electron';
export default (win?: BrowserWindow): void => {
  console.log('🚀::::::🐶💩', win);
  ipcMain.on('message', (event, data) => {
    event.sender.send('reMessage', '主线程收到了:' + data);
  });
  // ipcMain.handle('getDeployConfig', async (event, data) => {
  //   console.log(event, data);
  //   let temp = path.normalize(data);
  //   console.log(temp);
  //   let configFile = require(temp);
  //   return configFile;
  // });

  //模型加载完成 
  ipcMain.on('model-load', (event, data) => {
    console.log('🚀::::::🐶💩', data)
    
  })
};
