<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ipcRenderer } from 'electron'
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { getAssetPath } from './utils'
import Pet from './Pet'

const loading = ref(true)
let pet: Pet

onMounted(async () => {
  // window.addEventListener('load', () => {})
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

  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.z = 3

  // 创建 OrbitControls 控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 启用阻尼效果，使得平滑移动
  controls.enableZoom = false // 启用缩放
  controls.enablePan = false // 禁用平移（右键拖拽）

  // 创建Pet实例
  console.log('🚀::::::🐶💩', getAssetPath('compress-model.gltf'))
  pet = new Pet(getAssetPath('compress-model.gltf'), { scene, renderer, camera })
  pet.onClick = (event, model) => {
    modelClick(event, model)
  }
  pet.onDoubleClick = () => {
    console.log('Model double clicked')
  }

  pet.onProgress = (progress) => {
    console.log('Loading progress: ', progress * 100 + '%')
  }

  pet.onSuccess = (model) => {
    console.log('Model loaded successfully: ', model)
    loading.value = false
    setTimeout(() => {
      // 使用 GSAP 添加动画效果
      gsap.from(model.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'back.out' })
      container.appendChild(renderer.domElement)
    }, 1000)
  }

  pet.onError = (error) => {
    console.error('Error loading model: ', error)
  }
})

let rotationDuration = 1.5
let lastClickTime = 0

const modelClick = (event: MouseEvent, model: THREE.Object3D) => {
  // 设置 Pet 实例的回调函数
  const easing = { linear: 'linear', inOut: 'back.inOut' }

  const handerClick = (event: MouseEvent, model: THREE.Object3D<THREE.Object3DEventMap>) => {
    const currentTime = performance.now() // 获取当前时间戳，以毫秒为单位
    const timeDiff = currentTime - lastClickTime
    rotationDuration = timeDiff < 500 ? rotationDuration * 0.9 : 1.5
    const duration = rotationDuration
    const ease = timeDiff < 500 ? easing.linear : easing.inOut
    lastClickTime = currentTime
    ipcRenderer.send('model-load', { a: 1 })
    gsap.fromTo(
      model.rotation,
      {
        y: model.rotation.y // 当前模型的旋转角度作为起始值
      },
      { y: model.rotation.y + Math.PI * 2, duration, ease }
    )
  }
  handerClick(event, model)
}
</script>

<template>
  <div id="pet-container" v-loading="loading" class="bg-transparent w-full h-full"></div>
</template>
