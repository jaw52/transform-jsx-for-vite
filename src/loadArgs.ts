import cac from 'cac'
import consola from 'consola'
import { version } from '../package.json'

export const loadArgs = (): string[] => {
  try {
    const cli = cac('@jaw52/transform-jsx-for-vite')
    cli
      .version(version)
      .option('--ignore <ignore>', 'ignore path')
      .help()

    const { options = { ignore: [] } } = cli.parse()

    return (Array.isArray(options?.ignore) ? options?.ignore : [options?.ignore])
      .filter(el => el && typeof el === 'string')
  } catch (error) {
    consola.error(error)
    process.exit(1)
  }
}
