import Vue from 'nativescript-vue'
import App from './pages/App'
import store from './store';
import RadListView from 'nativescript-ui-listview/vue';
import FloatLabel from './components/inputs/FloatLabel';
import FloatTextView from './components/inputs/FloatTextView';
import Login from './pages/Login.vue'


import VueDevtools from 'nativescript-vue-devtools'


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

Vue.component('FloatLabel', FloatLabel);
Vue.component('FloatTextView', FloatTextView);
Vue.use(RadListView);
Vue.registerElement('RadioGroup', () => require('@webileapps/nativescript-radiobutton').RadioGroup)
Vue.registerElement('RadioButton', () => require('@webileapps/nativescript-radiobutton').RadioButton)


// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

const appSettings = require("application-settings");

const user_id = appSettings.getString("user_id");
console.log('user id is ', user_id)
if(user_id) {
  new Vue({
    store,
    render: h => h('frame', [h(App)])
  }).$start()
  
} else {
  new Vue({
    store,
    render: h => h('frame', [h(Login)])
  }).$start()
  
}

