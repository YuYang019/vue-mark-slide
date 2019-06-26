import Vue from 'vue'
import App from './App.vue'

// Vue.component('App', App)

new Vue({
  // render: h => h('div', { attrs: { id: 'app' } })
  // render(h) {
  //   console.log('render')
  //   return h('div', { attrs: { id: 'app' }})
  // }
  render: h => h(App)
}).$mount('#app')


