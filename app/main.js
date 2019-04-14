import Vue from 'nativescript-vue'
import App from './pages/App'
import store from './store';
import RadListView from 'nativescript-ui-listview/vue';
// import FloatLabel from './components/inputs/FloatLabel';
import Swipe from './components/SwipeActions.vue'


import VueDevtools from 'nativescript-vue-devtools'


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

// Vue.component('FloatLabel', FloatLabel);
Vue.use(RadListView);


// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')



new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
