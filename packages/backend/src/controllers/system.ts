import SystemService from '../services/system';
import express from 'express';

export default class SystemController {
  public path = '/system';
  public router = express.Router();

  private systemService: SystemService;

  public constructor(systemService: SystemService) {
    this.systemService = systemService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/status`, this.getStatus);
  }

  private getStatus = async (
    _: express.Request,
    response: express.Response
  ) => {
    response.send({
      ready: this.systemService.isReady(),
    });
  };
}
