import express from 'express';
import { spotifyApi } from './../index';

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

  private login = (
    request: express.Request,
    response: express.Response
  ): void => {
    response.redirect(
      spotifyApi.createAuthorizeURL(
        ['user-read-playback-state', 'user-modify-playback-state'],
        'some-state'
      )
    );
  };

  private callback = (
    request: express.Request,
    response: express.Response
  ): void => {
    const token = request.query.code as string;

    spotifyApi.authorizationCodeGrant(token).then((body) => {
      console.log('Got token');
      spotifyApi.setAccessToken(body.body.access_token);
      spotifyApi.setRefreshToken(body.body.refresh_token);
    });

    response.sendStatus(204);
  };
}
