<template>
  <div id="app">
    <MarkDisplay :markdown="content" :enhancer="enhancerGenerator()" @title="setTitle" autoBaseUrl autoBlankTarget autoFontSize keyboardCtrl urlHashCtrl supportPreview />
  </div>
</template>

<script>
import MarkDisplay from './components/vue-mark-display/stage.vue'
import content from '@internal/ppt.md'
import config from '@internal/vslide.config.js'

const markdownEnhancer = config.markdown || null 

export default {
  components: { MarkDisplay },
  data() {
    return {
      content,
    }
  },
  methods: {
    setTitle({ title }) {
      setTimeout(() => {
        document.title = title || "My Slides"
      })
    },
    enhancerGenerator() {
      return markdownEnhancer
    }
  }
}
</script>

<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  color: #2c3e50;
}
</style>