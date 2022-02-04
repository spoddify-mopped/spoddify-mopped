import SpotifyAuth from '../entities/spotify_auth';
import SpotifyClient from '../clients/spotify/spotify';
import express from 'express';

export default class AuthController {
  public path = '';
  public router = express.Router();

  private spotifyClient: SpotifyClient;

  public constructor(spotifyClient: SpotifyClient) {
    this.spotifyClient = spotifyClient;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/auth`, this.login);
    this.router.get(`${this.path}/callback`, this.callback);
  }

  private login = (_: express.Request, response: express.Response): void => {
    response.redirect(
      this.spotifyClient.getOAuthUrl([
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

    this.spotifyClient
      .authorizationCodeGrant(code)
      .then(async (data) => {
        const spotifyAuth = new SpotifyAuth();
        spotifyAuth.tokenType = 'refresh';
        spotifyAuth.tokenValue = data.refresh_token;
        await spotifyAuth.save();

        this.spotifyClient.setRefreshToken(data.refresh_token);
        this.spotifyClient.setAccessToken(data.access_token);
        response.sendStatus(204);
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };
}
