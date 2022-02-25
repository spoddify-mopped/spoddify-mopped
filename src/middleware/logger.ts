import Logger from '../logger/logger';
import express from 'express';

const logger = Logger.create('router');

const loggerMiddleware = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void => {
  const start = Date.now();

  response.on('finish', () => {
    if (!request.originalUrl.includes('/api')) {
      return;
    }

    const duration = `\x1b[32m${Date.now() - start}ms\x1b[0m`;
    const method = `\x1b[34m${request.method}\x1b[0m`;

    const path = request.originalUrl.split('?')[0];

    if (response.statusCode >= 400) {
      const status = `\x1b[31m${response.statusCode} ${response.statusMessage}\x1b[0m`;
      logger.error(
        `${method} '${path}' for ${request.ip}, ${status} in ${duration}`
      );
      return;
    }

    const status = `\x1b[32m${response.statusCode} ${response.statusMessage}\x1b[0m`;
    logger.debug(
      `${method} '${path}' for ${request.ip}, ${status} in ${duration}`
    );
  });

  next();
};

export default loggerMiddleware;
