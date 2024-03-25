'use strict';

import { app } from '@electron/remote';
const path = require('path');

export const isDev = process.env.npm_node_execpath ? true : false

/**
 * @description: 获取模型导入路径
 * @return {*}
 * @param {string} name
 */
export const getAssetPath = (name: string): string => {
  if (isDev) {
    return '/public/' + name
  }
  // 在 electron-builder 配置打包路径
  // 生产macos
  if (process.platform == 'darwin') {
    console.log('🚀::::::🐶💩', '我是mac')
    return path.dirname(app.getPath('exe')).split('/MacOS')[0] + '/Resources/app/dist/' + name
  }
  // 生产win
  if (process.platform === 'win32') {
    console.log('🚀::::::🐶💩','我是wn32', path.dirname(app.getPath('exe')) + '\\resources\\app\\dist\\' + name)
    return path.dirname(app.getPath('exe')) + '\\resources\\app\\dist\\' + name
  }
  // 其他情况，返回默认路径
  return '';
}

