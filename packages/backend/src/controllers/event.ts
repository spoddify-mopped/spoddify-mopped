import WebsocketHandler from '../ws/handler';
import express from 'express';

export default class EventController {
  public path = '/event';
  public router = express.Router();

  private websocketHandler: WebsocketHandler;

  public constructor(websocketHandler: WebsocketHandler) {
    this.websocketHandler = websocketHandler;

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
    response.sendStatus(204);
  };
}
