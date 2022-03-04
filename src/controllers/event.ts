import Player from '../player/player';
import { StatusCodes } from 'http-status-codes';
import express from 'express';

export default class EventController {
  public path = '/event';
  public router = express.Router();

  public constructor(private readonly player: Player) {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.newEvent);
  }

  private newEvent = (
    _request: express.Request,
    response: express.Response
  ): void => {
    this.player.updatePlayer();
    response.sendStatus(StatusCodes.NO_CONTENT);
  };
}
