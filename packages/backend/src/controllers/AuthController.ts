import express from 'express';
import { spotifyClient } from './../index';

export default class AuthController {
  public path = '';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/auth`, this.login);
    this.router.get(`${this.path}/callback`, this.callback);
  }

  private login = (_: express.Request, response: express.Response): void => {
    response.redirect(
      spotifyClient.getOAuthUrl([
        'user-read-playback-state',
        'user-modify-playback-state',
      ])
    );
  };

  private callback = (
    request: express.Request,
    response: express.Response
  ): void => {
    const code = request.query.code as string;

    spotifyClient
      .authorizationCodeGrant(code)
      .then(async (data) => {
        spotifyClient.setRefreshToken(data.refresh_token);
        spotifyClient.setAccessToken(data.access_token);
        response.sendStatus(204);
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };
}
