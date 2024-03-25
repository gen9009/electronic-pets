import TencentCloudChat from '@tencentcloud/chat'
import IM_SETTING from '../config/IM_SETTING';
const chat = TencentCloudChat.create({
  SDKAppID: IM_SETTING.SDKAppID,
});
// let onSdkReady = function (event) {
//   let message = chat.createTextMessage({
//     to: 'user1',
//     conversationType: 'C2C',
//     payload: { text: 'Hello world!' }
//   });
//   chat.sendMessage(message);
// };
// chat.on(TencentCloudChat.EVENT.SDK_READY, onSdkReady);

export default chat
