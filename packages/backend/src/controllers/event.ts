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

  private newEvent = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await this.websocketHandler.sendPlayerState();
    response.sendStatus(204);
  };
}
