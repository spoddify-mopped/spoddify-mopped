import { Server } from 'socket.io';
import WebsocketHandler from '../ws/handler';
import express from 'express';

export default class EventController {
  public path = '/event';
  public router = express.Router();

  private io: Server;
  private websocketHandler: WebsocketHandler;

  public constructor(io: Server, websocketHandler: WebsocketHandler) {
    this.io = io;
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
    await this.websocketHandler.sendPlayerState(this.io);
    response.sendStatus(204);
  };
}
