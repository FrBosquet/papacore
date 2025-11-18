import chalk from 'chalk';
import ora, { Ora } from 'ora';

export class Logger {
  private spinner?: Ora;

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = undefined;
    }
  }

  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = undefined;
    }
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = undefined;
    }
  }
}

export const logger = new Logger();
