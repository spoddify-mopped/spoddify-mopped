import * as path from 'path';

import Logger from '../../logger/logger';

const logger = Logger.create(__filename);

beforeEach(() => {
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('MOCKED-DATE');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('warn', () => {
  it('logs out the correct formatted message', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
    const message = 'This is a demo warning.';

    logger.warn(message);

    const date = new Date().toISOString();
    const filepath = path.relative(process.cwd(), __filename);

    expect(consoleWarnMock).toBeCalledWith(
      `\x1b[36m${date}\x1b[0m \x1b[33m[W]\x1b[0m \x1b[32m${filepath} >>>\x1b[0m`,
      message
    );
  });
});

describe('debug', () => {
  it('logs out the correct formatted message when debug mode is enabled', () => {
    Logger.setVerbose(true);

    const consoleDebugMock = jest.spyOn(console, 'debug').mockImplementation();
    const message = 'This is a demo debug message.';

    logger.debug(message);

    const date = new Date().toISOString();
    const filepath = path.relative(process.cwd(), __filename);

    expect(consoleDebugMock).toBeCalledWith(
      `\x1b[36m${date}\x1b[0m \x1b[34m[D]\x1b[0m \x1b[32m${filepath} >>>\x1b[0m`,
      message
    );
  });

  it('logs out nothing when debug mode is disabled', () => {
    Logger.setVerbose(false);

    const consoleDebugMock = jest.spyOn(console, 'debug').mockImplementation();
    const message = 'This is a demo debug message 2.';

    logger.debug(message);

    expect(consoleDebugMock).toBeCalledTimes(0);
  });
});

describe('error', () => {
  it('logs out the correct formatted message', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    const message = 'This is a error.';

    logger.error(message);

    const date = new Date().toISOString();
    const filepath = path.relative(process.cwd(), __filename);

    expect(consoleErrorMock).toBeCalledWith(
      `\x1b[36m${date}\x1b[0m \x1b[31m[E]\x1b[0m \x1b[32m${filepath} >>>\x1b[0m`,
      message
    );
  });
});

describe('info', () => {
  it('logs out the correct formatted message', () => {
    const consoleInfoMock = jest.spyOn(console, 'info').mockImplementation();
    const message = 'This is a info.';

    logger.info(message);

    const date = new Date().toISOString();
    const filepath = path.relative(process.cwd(), __filename);

    expect(consoleInfoMock).toBeCalledWith(
      `\x1b[36m${date}\x1b[0m \x1b[32m[I]\x1b[0m \x1b[32m${filepath} >>>\x1b[0m`,
      message
    );
  });
});
