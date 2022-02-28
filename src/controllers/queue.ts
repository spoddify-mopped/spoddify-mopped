import QueueService from '../services/queue';
import express from 'express';

export default class QueueController {
  public path = '/queue';
  public router = express.Router();

  public constructor(private readonly queueService: QueueService) {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getQueue);
  }

  private getQueue = async (_: express.Request, response: express.Response) => {
    response.send(this.queueService.getQueue());
  };
}
