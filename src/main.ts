import '@unocss/reset/tailwind.css';
import './assets/common.scss'
import 'uno.css';
import { createApp } from 'vue'
import App from './App.vue'
import Directives from './directives/index'

const app = createApp(App)
  .use(Directives)
  .mount('#app')
export default app
