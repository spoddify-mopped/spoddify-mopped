import { SpotifydService } from '../services/spotifyd';
import { StatusCodes } from 'http-status-codes';
import SystemService from '../services/system';
import express from 'express';

export default class SystemController {
  public path = '/system';
  public router = express.Router();

  public constructor(
    private readonly spotifydService: SpotifydService,
    private readonly systemService: SystemService
  ) {
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
    response.sendStatus(StatusCodes.NO_CONTENT);
  };
}
