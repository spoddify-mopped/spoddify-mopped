import {
  AlreadyVotedError,
  NoPlaylistPlayingError,
} from './../services/voting';
import { body, matchedData } from 'express-validator';

import RequestError from '../error/request';
import { StatusCodes } from 'http-status-codes';
import VotingService from '../services/voting';
import express from 'express';

type VotingRequest = {
  mac: string;
};

export default class VotingController {
  public path = '/voting';
  public router = express.Router();

  public constructor(private readonly votingService: VotingService) {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(
      `${this.path}/like`,
      body('mac').isMACAddress(),
      this.like
    );
    this.router.post(
      `${this.path}/dislike`,
      body('mac').isMACAddress(),
      this.dislike
    );
  }

  private handleError = (error: Error): Error => {
    if (error instanceof AlreadyVotedError) {
      return new RequestError('The mac has already voted for this song.', 403);
    }

    if (error instanceof NoPlaylistPlayingError) {
      return new RequestError('No playlist is playing.', 404);
    }

    return error;
  };

  private like = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as VotingRequest;

    await this.votingService
      .like(data.mac)
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((error) => next(this.handleError(error)));
  };

  private dislike = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as VotingRequest;

    await this.votingService
      .dislike(data.mac)
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((error) => next(this.handleError(error)));
  };
}
