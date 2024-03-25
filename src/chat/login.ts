import LibGenerateTestUserSig from '../lib/generate-usersig-es.min.js'
import IM_SETTING from '../config/IM_SETTING'
import chat from './index'

const { SDKAppID, secretKey, EXPIRETIME, userID } = IM_SETTING
function generateUserSig() {
  const generator = new LibGenerateTestUserSig(SDKAppID, secretKey, EXPIRETIME);
  const userSig = generator.genTestUserSig(userID);
  return {
    SDKAppID,
    userSig,
  };
}

export function autoLogin() {
  let promise = chat.login({ userID, userSig: generateUserSig().userSig });
  promise.then(function (imResponse) {
    // console.log(imResponse.data); // 登录成功
    console.log('🚀::::::🐶💩', '登录成功！！！')
    if (imResponse.data.repeatLogin === true) {
      // 标识账号已登录，本次登录操作为重复登录。
      console.log(imResponse.data.errorInfo);
    }
  }).catch(function (imError) {
    console.warn('login error:', imError); // 登录失败的相关信息
  });
}
