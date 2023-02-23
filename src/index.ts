import fs from 'fs'
import { gray, green } from 'kolorist'
import prompts from 'prompts'
import { transformStart } from './transformStart'
import { warnUtil } from './consoleUtil'
import locales from './locales'

const runTransform = async () => {
  const { scanPath, isGitMv } = await prompts([
    {
      type: 'select',
      name: 'lang',
      message: 'Please select language',
      initial: 0,
      choices: [
        { title: '简体中文', value: 'zh' },
        { title: 'English', value: 'en' },
      ],
    },
    {
      type: 'text',
      name: 'scanPath',
      message: (_, values) => locales[values.lang].scanPath,
      initial: 'src',
    },
    {
      type: 'select',
      name: 'isGitMv',
      message: (_, values) => locales[values.lang].isGitMv,
      initial: 0,
      choices: [
        { title: 'Yes', value: 1 },
        { title: 'No', value: 0 },
      ],
    },
  ]) as { scanPath: string; isGitMv: 1 | 0; lang: 'zh' | 'en' }

  if (scanPath === undefined || isGitMv === undefined) {
    console.log('Exit')
    return
  }

  if (!fs.existsSync(scanPath) || fs.lstatSync(scanPath).isFile()) {
    warnUtil('Please check the path')
    return
  }
  const needTransformList = await transformStart(scanPath, isGitMv)

  if (needTransformList.length > 0) {
    console.log(`${green('√')} Finish${green('to jsx')}`)
  } else {
    console.log(`${gray('- No files found to be migrated')}`)
  }
}

runTransform()
