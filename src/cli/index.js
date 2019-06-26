#!/usr/bin/env node

const CAC = require('cac')
const { run } = require('../core/node/index')
const pkg = require('../../package.json')

const cac = CAC()

cac
  .command('run <file>', 'start server')
  .action((file, options) => {
    run({ file, ...options })
  })

cac.version(pkg.version).help()

cac.parse(process.argv)