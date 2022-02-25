import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { SpotifyApiError } from '../clients/spotify/error';
import express from 'express';
import { validationResult } from 'express-validator';

type RequestErrorResponse = {
  message: string;
  status: number;
};

export default class RequestError extends Error {
  public constructor(msg: string, public readonly statusCode: number) {
    super(msg);
  }

  public getErrorResponse = (): RequestErrorResponse => ({
    message: this.message,
    status: this.statusCode,
  });

  public static validationResult = (
    request: express.Request
  ): RequestError | undefined => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return new RequestError(
        validationError
          .array()
          .map((err) => `${err.msg} for parameter '${err.param}'`)[0],
        StatusCodes.BAD_REQUEST
      );
    }
  };

  public static fromSpotifyApiError = (err: SpotifyApiError): RequestError => {
    switch (err.status) {
      case StatusCodes.BAD_REQUEST:
      case StatusCodes.NOT_FOUND: {
        return new RequestError(err.message, err.status);
      }
      default:
        return new RequestError(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  };
}
