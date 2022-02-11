import RequestError from '../error/request';
import { SpotifyApiError } from '../clients/spotify/error';
import SpotifyAuth from '../entities/spotify_auth';
import SpotifyClient from '../clients/spotify/spotify';
import express from 'express';

const OAUTH_SCOPES = ['user-read-playback-state', 'user-modify-playback-state'];

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

    this.spotifyClient
      .authorizationCodeGrant(code)
      .then(async (data) => {
        const spotifyAuth = new SpotifyAuth();
        spotifyAuth.tokenType = 'refresh';
        spotifyAuth.tokenValue = data.refresh_token;
        await spotifyAuth.save();

        this.spotifyClient.setRefreshToken(data.refresh_token);
        this.spotifyClient.setAccessToken(data.access_token);
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
