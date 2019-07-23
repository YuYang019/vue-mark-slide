module.exports = {
  // give a markdown URL
  src: '',
  // initial page number
  page: 1,
  // base href in <base /> html tag
  baseUrl: '',
  // whether use `src` as the `baseUrl` automatically
  autoBaseUrl: true,
  // whether open links in a blank target by default
  autoBlankTarget: false,
  // whether adjust font-size to adapt the screen size
  autoFontSize: true,
  // whether support keyboard shortcuts (Arrows, Enter, Ctrl+G)
  keyboardCtrl: true,
  // whether update URL hash when page changed
  urlHashCtrl: true,
  // support opening an iframe on top of the page to preview a URL
  // when click the `<a>` link with `altKey` pressed
  supportPreview: true,
  // enhance marked
  markdown(marked) {
    console.log('enhance marked')
  }
}
