import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import { store } from './store/store'
import { routes } from './routes'

import socketIo from 'socket.io-client';
import VueScoketIo from 'vue-socket.io';

const SocketInstance = socketIo('http://localhost:3000');
Vue.use(VueScoketIo, SocketInstance);


Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
