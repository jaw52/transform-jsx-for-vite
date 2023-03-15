import fs from 'fs'
import consola from 'consola'
import prompts from 'prompts'
import { green } from 'kolorist'
import locales from './utils/locales'
import { transformStart } from './transformStart'

/* 用户参数 */
export interface Setting {
  scanPath: string
  isGitMv: 1 | 0
  lang: 'zh' | 'en'
  mode: 'fast' | 'precise'
}

const runTransform = async () => {
  const { scanPath, isGitMv, lang = 'zh', mode = 'fast' } = await prompts([
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
      validate: value => (!fs.existsSync(value?.trim()) || fs.lstatSync(value?.trim()).isFile()) ? 'Please check the path' : true,
      initial: 'src',
    },
    {
      type: 'select',
      name: 'mode',
      message: (_, values) => locales[values.lang].mode,
      initial: 0,
      choices: (_, values) => [
        { title: locales[values.lang].fast, value: 'fast' },
        { title: locales[values.lang].precise, value: 'precise' },
      ],
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
  ], {
    onCancel: () => process.exit(1),
  }) as Setting

  const needTransformList = await transformStart({ scanPath: scanPath.trim(), isGitMv, lang, mode })
  const t = locales[lang]

  if (needTransformList.length > 0) {
    consola.success(`${t.finish} ${green('to jsx')}`)

    const { show = false } = await prompts({
      name: 'show',
      type: 'confirm',
      message: `${t.show}?`,
      initial: false,
    }) as { show?: boolean }

    if (show)
      needTransformList.forEach(item => consola.log(item))
  }
  else {
    consola.info(t.noFiles)
  }
}

runTransform()
