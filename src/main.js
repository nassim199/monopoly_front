import Vue from 'vue'
import App from './App.vue'

import config from './config'

import VueRouter from 'vue-router'
import { store } from './store/store'
import { routes } from './routes'

import socketIo from 'socket.io-client';
//import VueScoketIo from 'vue-socket.io-extended';
import VueSocketIo from 'vue-socket.io';


const SocketInstance = socketIo(config.serverLink);
Vue.use(VueSocketIo, SocketInstance);


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
