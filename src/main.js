import Vue from 'vue'
import App from './App.vue'
import store from './store/store'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })

new Promise((resolve) => {
  if (window.monaco) {
    resolve(window.monaco)
  } else {
    window.require(['vs/editor/editor.main'], () => {
      window.monaco = monaco
      resolve(monaco)
    })
  }
}).then(() => {
  const app = new Vue({
    el: '#app',
    store,
    render: h => h(App)
  })
})


