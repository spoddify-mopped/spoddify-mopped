import { SpotifydService } from '../services/spotifyd';
import SystemService from '../services/system';
import express from 'express';

export default class SystemController {
  public path = '/system';
  public router = express.Router();

  private spotifydService: SpotifydService;
  private systemService: SystemService;

  public constructor(
    spotifydService: SpotifydService,
    systemService: SystemService
  ) {
    this.spotifydService = spotifydService;
    this.systemService = systemService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/status`, this.getStatus);
    this.router.get(`${this.path}/spotifyd/status`, this.getSpotifydStatus);
    this.router.post(`${this.path}/spotifyd/restart`, this.restartSpotifyd);
  }

  private getStatus = async (
    _: express.Request,
    response: express.Response
  ) => {
    response.send({
      ready: this.systemService.isReady(),
    });
  };

  private getSpotifydStatus = async (
    _: express.Request,
    response: express.Response
  ) => {
    response.send(this.spotifydService.getStatus());
  };

  private restartSpotifyd = async (
    _: express.Request,
    response: express.Response
  ) => {
    this.spotifydService.stop();
    this.spotifydService.start();
    response.sendStatus(204);
  };
}
