<template>
  <div id="app">
    <MarkDisplay :markdown="content" :enhancer="enhancerGenerator()" @title="setTitle" autoBaseUrl autoBlankTarget autoFontSize keyboardCtrl urlHashCtrl supportPreview />
  </div>
</template>

<script>
import MarkDisplay from './components/vue-mark-display/stage.vue'
import content from './.temp/ppt.md'
import config from "./.temp/vslide.config.js"

const markdown = config.markdown || null 

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
      return markdown
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