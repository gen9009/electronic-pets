<template>
  <div id="loading" class="w-full h-full transition-all" ref="loading"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getAssetPath } from '../../utils'
const loading = ref()
onMounted(async () => {
  await import(getAssetPath('lottie.js'))

  bodymovin.loadAnimation({
    container: loading.value, // Required
    path: getAssetPath('汉堡.json'), // Required
    renderer: 'svg', // Required
    loop: true, // Optional
    autoplay: true, // Optional
    name: '汉堡'
  })
})
</script>
