const marked = require('marked')
const highlight = require('../highlight')
const { getFragment } = require('./utils')

marked.setOptions({
  highlight
})

describe('highlight', () => {
    const code = getFragment('code.md')

    test('should highlight the code', () => {
        const output = marked.parse(code)
        expect(output).toMatchSnapshot()
    })
})