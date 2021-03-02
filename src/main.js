// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import md5 from 'js-md5';
import axios from 'axios'

import store from './store/index.js'
import Moment from 'moment'
import Vuex from 'vuex'

Vue.use(Vuex)


Vue.prototype.$axios = axios
Vue.prototype.axios = axios
Vue.prototype.$md5 = md5;

import './assets/css/reset.css';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/resetUI.css'
import './style/superFont.css'
import './style/common.css'
Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.filter('formateTime', function (data, format) {
  return Moment(data).format(format)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
