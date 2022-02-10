import { StatusCodes } from 'http-status-codes';
import express from 'express';
import { validationResult } from 'express-validator';

type RequestErrorResponse = {
  message: string;
  status: number;
};

export default class RequestError extends Error {
  public statusCode: number;

  public constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
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
}
