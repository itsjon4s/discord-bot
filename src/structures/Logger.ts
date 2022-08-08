import chalk from 'chalk'
import { inspect } from 'util'

export class Logger {

  public ready(content: string) {
    console.log(`${chalk.green('ready')} -`, content)
  }

  public info(content: string) {
    console.log(`${chalk.blue('info')} -`, content)
  }

  public warn(content: string) {
    console.log(`${chalk.yellow('warn')} -`, content)
  }

  public error(content: unknown) {
    console.log(`${chalk.red('error')} -`, this.isError(content) ? inspect(content) : content)
  }

  private isError(error: any): boolean {
    return !!(error instanceof Error)
  }

}