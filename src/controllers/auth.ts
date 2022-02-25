import RequestError from '../error/request';
import { SpotifyApiError } from '../clients/spotify/error';
import SpotifyAuth from '../db/spotify_auth';
import SpotifyClient from '../clients/spotify/spotify';
import { SpotifydService } from '../services/spotifyd';
import express from 'express';

const OAUTH_SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
];

export default class AuthController {
  public path = '';
  public router = express.Router();

  public constructor(
    private readonly spotifyClient: SpotifyClient,
    private readonly spotifydService: SpotifydService
  ) {
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
    const redirectUri = request.query['redirect_uri'] as string;

    if (redirectUri) {
      response.cookie('redirect_uri', redirectUri);
    } else {
      response.clearCookie('redirect_uri');
    }

    response.redirect(this.spotifyClient.getOAuthUrl(OAUTH_SCOPES));
  };

  private callback = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void => {
    const code = request.query.code as string;
    const redirectUri = request.cookies['redirect_uri'] as string;
    response.clearCookie('redirect_uri');

    this.spotifyClient
      .authorizationCodeGrant(code)
      .then(async (data) => {
        const spotifyAuth = new SpotifyAuth();
        spotifyAuth.tokenType = 'refresh';
        spotifyAuth.tokenValue = data.refresh_token;
        await spotifyAuth.save();

        this.spotifyClient.setRefreshToken(data.refresh_token);
        this.spotifyClient.setAccessToken(data.access_token);

        await this.spotifydService.start();

        response.redirect(redirectUri ? redirectUri : '/');
      })
      .catch((error) => {
        if (error instanceof SpotifyApiError) {
          next(RequestError.fromSpotifyApiError(error));
        } else {
          next(error);
        }
      });
  };
}
