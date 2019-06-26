<template>
  <div id="app">
    <MarkDisplay :markdown="content" @title="setTitle" autoBaseUrl autoBlankTarget autoFontSize keyboardCtrl urlHashCtrl supportPreview />
  </div>
</template>

<script>
import MarkDisplay from 'vue-mark-display'
import content from './.temp/ppt.md'
// const content = `<TEMPLATE_CONTENT>`
console.log(content)

export default {
  components: { MarkDisplay },
  data() {
    return {
      content
    }
  },
  methods: {
    setTitle({ title }) {
      setTimeout(() => {
        document.title = title || "My Slides"
      })
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