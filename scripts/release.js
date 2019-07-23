/**
 * release 脚本
 * 发布新版本的时候，请保证这段时间有除了 chore 之外的 commit
 */

const execa = require('execa')
const semver = require('semver')
const inquirer = require('inquirer')
const pkg = require('../package.json')

const curVersion = pkg.version

const release = async () => {
  console.log(`Current version: ${curVersion}`)

  const types = ['patch', 'minor', 'major', 'prerelease', 'premajor']
  const versions = {}

  types.forEach(type => {
    versions[type] = semver.inc(curVersion, type)
  })

  const typeChoices = types.map(type => ({
    name: `${type} (${versions[type]})`,
    value: type
  }))
  const npmTags = ['latest', 'next']

  const { type, customVersion, npmTag } = await inquirer.prompt([
    {
      name: 'type',
      message: 'select release type:',
      type: 'list',
      choices: [...typeChoices, { name: 'custom', value: 'custom' }]
    },
    {
      name: 'customVersion',
      message: 'Input custom version:',
      type: 'input',
      when: answers => answers.type === 'custom'
    },
    {
      name: 'npmTag',
      message: 'Input npm tag:',
      type: 'list',
      choices: npmTags
    }
  ])

  console.log(type, customVersion, npmTag)
  const version = customVersion || versions[type]

  const { yes } = await inquirer.prompt([
    {
      name: 'yes',
      message: `Confirm release ${version} (${npmTag})? `,
      type: 'list',
      choices: ['N', 'Y']
    }
  ])

  if (yes === 'N') {
    console.log('[release] cancelled.')
    return
  }

  // npm version 如果运行在一个 git repo 下，会产生一个 commit
  await execa('npm', ['version', version], { stdio: 'inherit' })
  // generate changelog and commit
  await execa('npm', ['run', 'changelog'])
  await execa('git', ['add', '.'], { stdio: 'inherit' })
  await execa('git', ['commit', '-m', `chore: ${version} changelog`], {
    stdio: 'inherit'
  })
  // git push
  await execa('git', ['push'], { stdio: 'inherit' })

  // 最后执行发布
  await execa('npm', ['publish', '--tag', npmTag], { stdio: 'inherit' })
}

release().catch(err => {
  console.error(err)
  process.exit(1)
})
