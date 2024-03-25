import TencentCloudChat from '@tencentcloud/chat';
import chat from './index'

class MessageC2C {
  public to: string;
  public msgText: string

  constructor(to: string) {
    this.to = to
    var event = new CustomEvent('receiveMessage', { bubbles: true, cancelable: true, composed: true, detail: { message: null } })
    chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, (message: any) => {
      event.detail.message = message
      window.dispatchEvent(event)
    });

  }

  public send(msgText: string): Promise<any> {
    this.msgText = msgText
    let options = {
      to: this.to,
      cloudCustomData: msgText,//云端数据
      payload: {
        text: msgText
      },
      conversationType: TencentCloudChat.TYPES.CONV_C2C // 端到端会话
    }
    // 1. 创建消息
    const message = chat.createTextAtMessage(options)
    // 2. 发送消息
    let promise = chat.sendMessage(message);
    return promise
  }
}

export default MessageC2C
