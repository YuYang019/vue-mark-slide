module.exports = function(source) {
  source = source
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/"/g, '\\"') // 两次转义

  let template = 'const content = "CODE"; export default content'
  let code = template.replace(/CODE/, source)

  return code
}