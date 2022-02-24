import * as path from 'path';

enum LogType {
  INFO = '[I]',
  DEBUG = '[D]',
  ERROR = '[E]',
  WARN = '[W]',
}

export default class Logger {
  private static verbose = false;

  private name: string;

  private constructor(name: string) {
    this.name = name;
  }

  private generatePrefix = (logType: LogType): string => {
    const timestamp = `\x1b[36m${new Date().toISOString()}\x1b[0m`;
    let type = '';

    switch (logType) {
      case LogType.INFO: {
        type = `\x1b[32m${logType}\x1b[0m`;
        break;
      }
      case LogType.WARN: {
        type = `\x1b[33m${logType}\x1b[0m`;
        break;
      }
      case LogType.ERROR: {
        type = `\x1b[31m${logType}\x1b[0m`;
        break;
      }
      case LogType.DEBUG: {
        type = `\x1b[34m${logType}\x1b[0m`;
        break;
      }
    }

    const file = `\x1b[32m${path.relative(
      process.cwd(),
      this.name
    )} >>>\x1b[0m`;

    return `${timestamp} ${type} ${file}`;
  };

  public info = (...args: unknown[]): void => {
    console.info(this.generatePrefix(LogType.INFO), ...args);
  };

  public error = (...args: unknown[]): void => {
    console.error(this.generatePrefix(LogType.ERROR), ...args);
  };

  public debug = (...args: unknown[]): void => {
    if (Logger.verbose) {
      console.debug(this.generatePrefix(LogType.DEBUG), ...args);
    }
  };

  public warn = (...args: unknown[]): void => {
    console.warn(this.generatePrefix(LogType.WARN), ...args);
  };

  public static setVerbose = (v: boolean): void => {
    Logger.verbose = v;
  };

  public static create = (name: string): Logger => {
    return new Logger(name);
  };
}
