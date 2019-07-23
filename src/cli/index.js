#!/usr/bin/env node

const CAC = require('cac')
const chalk = require('chalk')
const { run } = require('../core/node/index')
const pkg = require('../../package.json')
const logger = require('../core/utils/logger')

const cac = CAC()

cac.command('run <file>', 'start server').action((file, options) => {
  try {
    run({ file, ...options })
  } catch (err) {
    console.error(chalk.red(err.stack))
    process.exitCode = 1
  }
})

// handle unknown command
cac.on('command:*', () => {
  logger.error('Invalid command: %', cac.args.join(' '))
  console.log('    ')
  cac.outputHelp()
  process.exit(1)
})

cac.version(pkg.version).help()

cac.parse(process.argv)
