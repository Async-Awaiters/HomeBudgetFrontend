import { createApp } from 'vue'
import 'vuetify/styles'
import { createPinia } from 'pinia'

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from './App.vue'
import connector from '@/mixins/connector';
import router from './router';


const vuetify = createVuetify({
    components,
    directives,
})
const app = createApp(App);
const pinia = createPinia()
app.use(pinia)
app.mixin(connector)
app.use(vuetify)
app.use(router)
app.mount('#app')
