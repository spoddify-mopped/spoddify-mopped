import VotingService from '../services/voting';
import express from 'express';

type VoteRequest = {
  uuid: string;
  skip: boolean;
};

export default class VotingController {
  public path = '/vote';
  public router = express.Router();

  private votingService: VotingService;

  public constructor(votingService: VotingService) {
    this.votingService = votingService;
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.vote);
  }

  public vote = (
    request: express.Request,
    response: express.Response
  ): void => {
    const body = request.body as VoteRequest;

    try {
      this.votingService.addVote(body.uuid, body.skip);
      response.sendStatus(204);
    } catch {
      response.sendStatus(409);
    }
  };
}
