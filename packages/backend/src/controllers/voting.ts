import { body, matchedData } from 'express-validator';

import RequestError from '../error/request';
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
    this.router.post(
      `${this.path}`,
      body('uuid').isString(),
      body('skip').isBoolean(),
      this.vote
    );
  }

  public vote = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as VoteRequest;

    try {
      this.votingService.addVote(data.uuid, data.skip);
      response.sendStatus(204);
    } catch {
      response.sendStatus(409);
    }
  };
}
