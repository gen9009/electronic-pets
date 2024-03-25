<template>
  <component :is="renderMessage"></component>
</template>
<script setup lang="tsx">
import style from './index.module.scss'
import { ref, reactive, inject, watch, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
const chatHistory = inject('chatHistory', [])
const messageList = reactive([])


watch(
  chatHistory,
  (newV, oldV) => {
    // 手动清除
    if (newV.length == 0 && oldV.length !== 0) {
      messageList.forEach((v) => removeMessageItem(v))
    }
    addMessage()
  },
  {
    deep: true
  }
)
const renderMessage = () => {
  return (
    <div ref="message" class="flex flex-col w-100px m-b-5px pointer-events-none">
      {messageList}
    </div>
  )
}
const renderMessageItem = (item) => {
  return (
    <div class={style['message-item']} class={item.type == 'to' ? style['left'] : style['right']} data-date={item.date} key={item.date}>
      {item.text}
      <span class="absolute text-8px w-max  bg-amber rounded top-[-2px] p-2px" class={`${item.type == 'to' ? ' right-[calc(100%+2px)]' : ' left-[calc(100%+2px)]'}`}>
        {item.name}
      </span>
    </div>
  )
}
const addMessage = () => {
  if (!chatHistory.value.length) return
  const message = renderMessageItem(chatHistory.value.at(-1))
  messageList.push(message)
  if (messageList.length > 3) {
    const preMessage = messageList.slice(0, messageList.length - 3)
    nextTick(() => {
      preMessage.forEach((v) => {
        removeMessageItem(v)
      })
    })
  }
}
const removeMessageItem = (item) => {
  if (item.isGsap) return
  item.isGsap = true
  gsap.to(item.el, {
    y: -40,
    opacity: 0,
    scale: 0.5,
    duration: 0.5,
    ease: 'power4.inOut',
    onComplete() {
      setTimeout(() => {
        messageList.shift()
      }, 1000)
    }
  })
}
</script>
