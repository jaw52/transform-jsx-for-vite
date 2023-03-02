import cac from 'cac'
import consola from 'consola'
import { version } from '../../package.json'

export const loadArgs = (): string[] => {
  try {
    const cli = cac('@jaw52/transform-jsx-for-vite')
    cli
      .version(version)
      .option('--ignore <ignore>', 'ignore path')
      .help()

    const { options = { ignore: [] } } = cli.parse() as { options: { ignore?: (string | boolean)[] | string | boolean } }

    if (!options.ignore || typeof options.ignore === 'boolean')
      return []

    if (Array.isArray(options?.ignore))
      return options?.ignore.filter(Boolean).map(el => (el as string)?.trim())

    return options?.ignore.trim().split(',')
  }
  catch (error) {
    consola.error(error)
    process.exit(1)
  }
}
