import './assets/main.css'

import globalComponents from '@/plugins/global-components'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(globalComponents)
app.use(router)

app.mount('#app')
