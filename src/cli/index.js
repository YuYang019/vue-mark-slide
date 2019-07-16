#!/usr/bin/env node

const CAC = require('cac')
const { run } = require('../core/node/index')
const pkg = require('../../package.json')
const logger = require('../core/utils/logger')

const cac = CAC()

cac
  .command('run <file>', 'start server')
  .action((file, options) => {
    run({ file, ...options })
  })

// handle unknown command
cac
  .on('command:*', () => {
    logger.error('Invalid command: %', cac.args.join(' '))
    console.log('    ')
    cac.outputHelp()
    process.exit(1)
  })

cac.version(pkg.version).help()

cac.parse(process.argv)
