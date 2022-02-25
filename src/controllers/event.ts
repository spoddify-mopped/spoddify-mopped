import { StatusCodes } from 'http-status-codes';
import WebsocketHandler from '../ws/handler';
import express from 'express';

export default class EventController {
  public path = '/event';
  public router = express.Router();

  public constructor(private readonly websocketHandler: WebsocketHandler) {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.newEvent);
  }

  private newEvent = (
    _request: express.Request,
    response: express.Response
  ): void => {
    this.websocketHandler.sendPlayerState();
    response.sendStatus(StatusCodes.NO_CONTENT);
  };
}
