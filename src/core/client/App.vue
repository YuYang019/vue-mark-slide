<template>
    <div id="app">
        <MarkDisplay
            ref="main"
            @title="setTitle"
            :src="options.src"
            :markdown="content"
            :baseUrl="options.baseUrl"
            :enhancer="options.markdown"
            :autoBaseUrl="options.autoBaseUrl"
            :autoBlankTarget="options.autoBlankTarget"
            :autoFontSize="options.autoFontSize"
            :keyboardCtrl="options.keyboardCtrl"
            :urlHashCtrl="options.urlHashCtrl"
            :supportPreview="options.supportPreview"
        />
    </div>
</template>

<script>
import Hammer from 'hammerjs'
import MarkDisplay from './components/vue-mark-display/stage.vue'
import content from '@internal/ppt.md'
import config from '@internal/vslide.config.js'

const defaultOpts = {
    src: '',
    page: 1,
    baseUrl: '',
    // whether use `src` as the `baseUrl` automatically
    autoBaseUrl: true,
    // whether open links in a blank target by default
    autoBlankTarget: true,
    // whether adjust font-size to adapt the screen size
    autoFontSize: true,
    // whether support keyboard shortcuts (Arrows, Enter, Ctrl+G)
    keyboardCtrl: true,
    // whether update URL hash when page changed
    urlHashCtrl: true,
    // support opening an iframe on top of the page to preview a URL
    // when click the `<a>` link with `altKey` pressed
    supportPreview: true,
    markdown: null
}
const options = { ...defaultOpts, ...config }

export default {
    components: { MarkDisplay },
    data() {
        return {
            content,
            options: { ...options }
        }
    },
    methods: {
        setTitle({ title }) {
            setTimeout(() => {
                document.title = title || 'My Slides'
            })
        }
    },
    mounted() {
        const mc = new Hammer(this.$el)
        const main = this.$refs.main
        mc.on('swipe', event => {
            if (event.pointerType === 'mouse') {
                return
            }
            switch (event.direction) {
                case Hammer.DIRECTION_LEFT:
                    main.goNext()
                    return
                case Hammer.DIRECTION_RIGHT:
                    main.goPrev()
                    return
            }
        })
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
