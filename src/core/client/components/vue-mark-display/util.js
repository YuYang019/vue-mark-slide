export { parse as parseMarkdown, enhanceMarked } from './parser'

export const genMarkdown = () => '# Hello World\n\n----\n\ncontent\n'

export const genSlide = () => [
  {
    html: '<h1>Hello World</h1>',
    meta: { title: 'Hello World', type: '', slideStyle: '', bgStyle: '' },
    visited: false
  },
  {
    html: '<p>content</p>',
    meta: { title: 'content', type: '', slideStyle: '', bgStyle: '' },
    visited: false
  }
]

export const genLoadingSlide = () => [
  {
    html: '<p>Loading...</p>',
    meta: { title: 'Loading', type: '', slideStyle: '', bgStyle: '' },
    visited: false
  }
]

// url hash ctrl
export const setHash = page => {
  // to avoid location go away when changing baseURL
  const url = new URL(location.href)
  url.hash = `#${page}`
  location.replace(url.href)
}

export const getHash = () => {
  const matched = location.hash.match(/^\#(\d+)$/)
  return matched ? matched[1] : ''
}

// auto font size
export const defaultFontSize = 14

export const parseFontSize = () =>
  parseInt(Math.sqrt((window.innerWidth * window.innerHeight) / 240), 10)

// mixins
export const mixinInjected = {
  props: { slides: Array, current: Number },
  inject: ['stage'],
  computed: {
    computedSlides() {
      const { slides, stage } = this
      const injectedSlides = stage.slides || genSlide()
      return slides || injectedSlides
    },
    computedCurrentPage() {
      const { current, stage } = this
      const injectedCurrent = stage.currentPage || 1
      return current || injectedCurrent
    }
  }
}

export const genMixinGlobalEvents = (type, handler, host = window) => {
  let finalHandler = null
  return {
    mounted() {
      finalHandler = handler.bind(this)
      host.addEventListener(type, finalHandler)
    },
    destroyed() {
      if (finalHandler) {
        host.removeEventListener(type, finalHandler)
      }
    }
  }
}

// event handlers
export const keydownHandler = function(event) {
  const vm = this
  if (!vm.keyboardCtrl) {
    return
  }
  switch (event.keyCode) {
    case 13:
      // console.log('enter');
      break
    case 33:
      // console.log('left');
      vm.goPrev()
      break
    case 34:
      // console.log('right');
      vm.goNext()
      break
    case 37:
      // console.log('left');
      vm.goPrev()
      break
    case 38:
      // console.log('up');
      vm.goPrev()
      break
    case 39:
      // console.log('right');
      vm.goNext()
      break
    case 40:
      // console.log('down');
      vm.goNext()
      break
    case 71:
      // console.log('Ctrl+G')
      if (event.ctrlKey) {
        vm.promptJump()
      }
    default:
  }
}

export const resizeHandler = function() {
  const vm = this
  if (!vm.autoFontSize) {
    // vm.fontSize = defaultFontSize;
    return
  }
  vm.fontSize = parseFontSize()
}

export const hashHandler = function() {
  if (this.urlHashCtrl) {
    this.goto(parseInt(getHash(), 10))
  }
}

// Make the actual CORS request.
export const request = (url, cb) => {
  // All HTML5 Rocks properties support CORS.
  // const url = 'http://updates.html5rocks.com';

  const xhr = createCORSRequest('GET', url)
  if (!xhr) {
    // console.log('CORS not supported');
    return
  }

  // Response handlers.
  xhr.onload = function() {
    const text = xhr.responseText
    cb(null, text)
  }

  xhr.onerror = function() {
    cb(new Error('Woops, there was an error making the request.'), null)
  }

  xhr.send()
}

// Create the XHR object.
const createCORSRequest = (method, url) => {
  const xhr = new XMLHttpRequest()
  if ('withCredentials' in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true)
  } else if (typeof XDomainRequest != 'undefined') {
    // XDomainRequest for IE.
    xhr = new XDomainRequest()
    xhr.open(method, url)
  } else {
    // CORS not supported.
    xhr = null
  }
  return xhr
}
