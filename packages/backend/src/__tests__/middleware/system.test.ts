import SystemMiddleware from '../../middleware/system';
import SystemService from '../../services/system';
import express from 'express';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('checkReadiness', () => {
  it('calls next for a always available route', async () => {
    const systemServiceMock = new SystemService(null);
    const systemMiddleware = new SystemMiddleware(systemServiceMock);

    const request = {
      headers: { authorization: 'INVALID' },
      url: '/api/auth',
    } as express.Request;
    const next = jest.fn();

    systemMiddleware.checkReadiness(request, undefined, next);

    expect(next).toBeCalledTimes(1);
  });

  it('calls next for when system is ready', async () => {
    const systemServiceMock = new SystemService(null);
    const systemMiddleware = new SystemMiddleware(systemServiceMock);

    const request = {
      headers: { authorization: 'INVALID' },
      url: '/api/player',
    } as express.Request;
    const next = jest.fn();

    jest.spyOn(systemServiceMock, 'isReady').mockReturnValue(true);

    systemMiddleware.checkReadiness(request, undefined, next);

    expect(next).toBeCalledTimes(1);
  });

  it('send http 503 response for calling a not available route in unready state', async () => {
    const systemServiceMock = new SystemService(null);
    const systemMiddleware = new SystemMiddleware(systemServiceMock);

    const request = {
      headers: { authorization: 'INVALID' },
      url: '/api/player',
    } as express.Request;

    const response = {} as express.Response;
    response.status = jest.fn();
    response.send = jest.fn();

    jest.spyOn(systemServiceMock, 'isReady').mockReturnValue(false);
    jest.spyOn(response, 'status').mockReturnValue(response);

    systemMiddleware.checkReadiness(request, response, undefined);

    expect(response.status).toBeCalledWith(503);
  });
});
