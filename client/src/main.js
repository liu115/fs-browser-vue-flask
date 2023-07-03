import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVfm } from 'vue-final-modal'
// import VueAxios from 'vue-axios'
// import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-final-modal/style.css'
// import './assets/main.css'

const app = createApp(App)
const vfm = createVfm()

app.use(router)
app.use(vfm)
// app.use(VueAxios, axios)

app.mount('#app')
