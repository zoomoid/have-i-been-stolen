import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import store from './store'

Vue.config.productionTip = false

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.prototype.$scrollY = window.scrollY;

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
