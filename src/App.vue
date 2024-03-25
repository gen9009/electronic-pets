<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { ipcRenderer } from 'electron'
import { onMounted, provide, ref } from 'vue'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { getAssetPath } from './utils'
import { autoLogin } from './chat/login'
import MessageC2C from './chat/message'
import prompt from './components/prompt.vue'
import message from './components/message.vue'
import IM_SETTING from './config/IM_SETTING'
import Pet from './Pet'
let pet: Pet
let messageC2C: MessageC2C = new MessageC2C(IM_SETTING.to)
let loading = ref(true)
let promptRef = ref()
let chatHistory = ref<[{ text: string; name: string; date: string; type: 'to' | 'from' }]>([])
provide('chatHistory', chatHistory)
function initScene() {
  // 创建场景、渲染器和摄像头
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    alpha: true, //渲染器透明
    antialias: true, //抗锯齿
    precision: 'highp' //着色器开启高精度
  })
  const container = document.querySelector('#pet-container')!
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)

  const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.z = 2

  // 创建 OrbitControls 控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 启用阻尼效果，使得平滑移动
  controls.enableZoom = false // 启用缩放
  controls.enablePan = false // 禁用平移（右键拖拽）
  return { scene, renderer, camera, container }
}
function sendMessage(text: string) {
  messageC2C
    .send(text)
    .then((res) => {
      console.log('🚀::::::🐶💩', '发送消息成功', res)
      chatHistory.value!.push({
        text,
        date: performance.now().toFixed(0),
        name: res.data.message.nick,
        type: 'from'
      })
    })
    .catch((err) => {
      console.log('🚀::::::🐶💩发送消息失败', err)
    })
}

onMounted(async () => {
  autoLogin() // 自动登录
  window.addEventListener('receiveMessage', (event) => {
    console.log('🚀::::::🐶💩', '消息接受触发了')
    let text = event.detail.message.data[0].payload.text
    let nick = event.detail.message.data[0].nick
    if (!text) return
    chatHistory.value!.push({
      text,
      date: performance.now().toFixed(0),
      name: nick,
      type: 'to'
    })
  })

  const { scene, renderer, camera, container } = initScene()
  // 创建Pet实例
  pet = new Pet(getAssetPath('compress-model.gltf'), { scene, renderer, camera })
  pet.onClick = (event, model) => {
    modelClick(event, model)
  }
  pet.onRightClick = (event, model) => {
    modelRightClick(event, model)
  }
  pet.onDoubleClick = () => {
    console.log('Model double clicked')
  }

  pet.onProgress = (progress) => {
    // console.log('Loading progress: ', progress * 100 + '%')
  }

  pet.onSuccess = (model) => {
    // console.log('Model loaded successfully: ', model)
    loading.value = false
    setTimeout(() => {
      gsap.from(model.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'back.out' })
      container.appendChild(renderer.domElement)
    }, 1000)
  }

  pet.onError = (error) => {
    console.error('Error loading model: ', error)
  }
})

// 点击事件
let rotationDuration = 1.5
let lastClickTime = 0
const modelClick = (event: MouseEvent, model: THREE.Object3D) => {
  const handerClick = (event: MouseEvent, model: THREE.Object3D<THREE.Object3DEventMap>) => {
    const currentTime = performance.now() // 获取当前时间戳，以毫秒为单位
    const timeDiff = currentTime - lastClickTime
    rotationDuration = timeDiff < 500 ? rotationDuration * 0.9 : 1.5
    let times = +(-Math.log(1.5 / rotationDuration) / Math.log(0.9)).toFixed(0) // 点击次数
    let radian = times ? Math.PI * 3 * times : Math.PI * 3
    lastClickTime = currentTime
    // ipcRenderer.send('model-load', { a: 1 })
    gsap.fromTo(
      model.rotation,
      {
        y: model.rotation.y // 当前模型的旋转角度作为起始值
      },
      { y: model.rotation.y + radian, duration: 1.5, ease: CustomEase.create('custom', 'M0,0 C0.1,1 0.1,1 1,1') }
    )
  }
  handerClick(event, model)
}

// 右键事件
const modelRightClick = (event: MouseEvent, model: THREE.Object3D) => {
  const handerClick = (event: MouseEvent, model: THREE.Object3D<THREE.Object3DEventMap>) => {
    const currentTime = performance.now() // 获取当前时间戳，以毫秒为单位
    const timeDiff = currentTime - lastClickTime
    rotationDuration = timeDiff < 500 ? rotationDuration * 0.9 : 1.5
    let times = +(-Math.log(1.5 / rotationDuration) / Math.log(0.9)).toFixed(0) // 点击次数
    let radian = times ? Math.PI * 3 * times : Math.PI * 3
    lastClickTime = currentTime
    // ipcRenderer.send('model-load', { a: 1 })
    gsap.fromTo(
      model.rotation,
      {
        y: model.rotation.y // 当前模型的旋转角度作为起始值
      },
      { y: model.rotation.y + radian, duration: 1.5, ease: CustomEase.create('custom', 'M0,0 C0.1,1 0.1,1 1,1') }
    )
    showPrompt()
  }
  handerClick(event, model)
}
function showPrompt() {
  promptRef.value.focus()
  if (promptRef.value.el.style.opacity == 1) return
  gsap.fromTo(
    promptRef.value.el,
    {
      opacity: 0
    },
    {
      opacity: 1,
      duration: 1, // 动画持续时间
      ease: 'power2.inOut' // 缓动函数，可以根据需要进行调整
    }
  )
}
</script>

<template>
  <div id="pet-container" v-loading="loading" class="bg-transparent w-100px h-100px fixed bottom-0 pointer-events-auto">
    <div class="absolute left-90px bottom-15px pointer-events-none">
      <message></message>
      <prompt ref="promptRef" @send="sendMessage" class="prompt op-0"></prompt>
    </div>
  </div>
</template>
