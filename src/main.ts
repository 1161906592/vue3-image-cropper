import { createApp } from 'vue'
import App from './app'
import router from './router'
import './styles/base.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
