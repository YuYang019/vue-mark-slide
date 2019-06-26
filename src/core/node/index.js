const App = require('./App')

function createApp(options) {
  return new App(options)
}

async function run(options) {
  const app = createApp(options)
  await app.process()
  return app.run()
}

exports.run = run