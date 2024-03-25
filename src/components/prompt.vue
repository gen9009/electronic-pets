<template>
  <div ref="promptRef" class="w-100px rounded border-1 bg-white pointer-events-auto">
    <div class="algin-content-end relative h-full flex flex-aic rounded transition-shadow transition-duration-500 [&:has(textarea:focus)]:shadow-[0_0px_10px_rgba(171, 105, 50)]">
      <textarea ref="textareaRef" class="max-h-32px p-2px p-l-5px p-r-20px flex-1 overflow-y-hidden font-500 color-#000 bg-white outline-none text-size-10px" rows="1" @input="autoExpand" @keyup.enter.exact="sendMsg" @keydown="wrap" autofocus />
      <i :class="`i-icon-park-twotone-enter-key  absolute right-7px bottom-2px h-14px w-14px rounded bg-#ccc  ${isEmpty ? '' : 'hover'}`"></i>
    </div>
    <i class="i-tdesign-chat-clear absolute left-[calc(100%+3px)] bottom-2px h-16px w-16px rounded border bg-#ccc hover" @click="clearMessage"></i>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick, inject } from 'vue'
const emits = defineEmits(['send'])
const prompt = ref<string>('')
const chatHistory = inject('chatHistory', [])
const promptRef = ref()
const textareaRef = ref()
const isEmpty = computed(() => !prompt.value.length)
const autoExpand = (e: Event) => {
  let textarea = e.target as HTMLInputElement
  // 计算内容的高度，并将 textarea 的高度设置为内容的高度
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
const sendMsg = (e: KeyboardEvent) => {
  let target = e.target as HTMLTextAreaElement
  if (!target.value) return
  emits('send', target.value)
  target.value = ''
}
const wrap = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) e.preventDefault()
}
const clearMessage = () => {
  promptRef.value.style.opacity = 0
  chatHistory.value = []
}
defineExpose({
  el: promptRef,
  focus: () => {
    textareaRef.value.focus()
  }
})
</script>
<style lang="scss" scoped>
textarea {
  caret-color: #000;
}
</style>
