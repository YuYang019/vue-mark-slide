const Prism = require('prismjs')

function wrap(code, lang) {
    return `<pre class="language-${lang}"><code>${code}</code></pre>`
}

module.exports = function highlight(code, lang) {

    if (lang === 'js') {
        lang = 'javascript'
    } else {
        lang = 'markup'
    }

    const html = Prism.highlight(code, Prism.languages[lang], lang)

    return wrap(html, lang)
}