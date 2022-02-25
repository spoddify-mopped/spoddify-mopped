import SystemService from '../services/system';
import express from 'express';

const availableRoutes = ['/api/auth', '/api/callback', '/api/system/status'];

export default class SystemMiddleware {
  public constructor(private readonly systemService: SystemService) {}

  public checkReadiness = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void => {
    const matchingUrl = request.url.split('?')[0];

    // Always pass non api routes - like frontend routes - and other available routes.
    if (
      !matchingUrl.includes('/api') ||
      availableRoutes.includes(matchingUrl)
    ) {
      return next();
    }

    if (this.systemService.isReady()) {
      return next();
    }

    response.status(503).send({
      msg: 'Service is not ready yet',
    });
  };
}
