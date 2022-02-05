import {
  AlbumTracksResponse,
  ArtistTopTracksResponse,
  AuthorizationCodeGrantResponse,
  FullArtist,
  Player,
  RefreshTokenResponse,
  SearchResult,
  Track,
  UserDevicesResponse,
} from './responses';
import {
  CombinedOptions,
  DeviceOptions,
  MarketOptions,
  PlayOptions,
} from './options';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import Logger from '../../logger/logger';
import qs from 'qs';

type Config = {
  clientSecret: string;
  clientId: string;
  redirectUri: string;
};

const SPOTIFY_BASE_AUTH_URL = 'https://accounts.spotify.com';
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

const LOGGER = Logger.create(__filename);

export default class SpotifyClient {
  private config: Config;

  private refreshToken: string | undefined;

  private httpClient: AxiosInstance;

  public constructor(config: Config) {
    this.config = config;

    this.httpClient = axios.create({
      baseURL: SPOTIFY_BASE_URL,
    });
  }

  public getOAuthUrl = (scopes: string[]): string => {
    const query = {
      // eslint-disable-next-line camelcase
      client_id: this.config.clientId,
      // eslint-disable-next-line camelcase
      redirect_uri: this.config.redirectUri,
      // eslint-disable-next-line camelcase
      response_type: 'code',
    };

    if (scopes.length > 0) {
      query['scope'] = scopes.join(' ');
    }

    return `${SPOTIFY_BASE_AUTH_URL}/authorize?${qs.stringify(query)}`;
  };

  public authorizationCodeGrant = async (
    code: string
  ): Promise<AuthorizationCodeGrantResponse> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('client_id', this.config.clientId);
    params.append('client_secret', this.config.clientSecret);
    params.append('redirect_uri', this.config.redirectUri);

    const response = await axios.post<AuthorizationCodeGrantResponse>(
      `${SPOTIFY_BASE_AUTH_URL}/api/token`,
      params
    );

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  };

  public requestRefreshedToken = async (
    refreshToken: string
  ): Promise<RefreshTokenResponse> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', this.config.clientId);
    params.append('client_secret', this.config.clientSecret);

    const response = await axios.post<RefreshTokenResponse>(
      `${SPOTIFY_BASE_AUTH_URL}/api/token`,
      params
    );

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  };

  public setAccessToken = (accessToken: string): void => {
    this.httpClient.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  };

  public setRefreshToken = (refreshToken: string): void => {
    this.refreshToken = refreshToken;
  };

  private tryWithToken = async <T>(
    cb: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> => {
    try {
      return await cb();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.status === 401) {
        LOGGER.info('Access token is expired. Trying to refresh it.');

        const response = await this.requestRefreshedToken(this.refreshToken);
        this.setAccessToken(response.access_token);
        return await cb();
      } else {
        throw error;
      }
    }
  };

  public getPlayer = async (): Promise<Player | undefined> => {
    const response = await this.tryWithToken<Player>(
      async () => await this.httpClient.get('/me/player')
    );

    if (response.status === 204) {
      return undefined;
    }

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(`Unexpected status code: ${response.status}`);
  };

  public search = async (
    query: string,
    types: string[],
    options: CombinedOptions = {}
  ): Promise<SearchResult> => {
    const response = await this.tryWithToken<SearchResult>(
      async () =>
        await this.httpClient.get('/search', {
          params: {
            q: query,
            type: types.join(','),
            ...options,
          },
        })
    );

    return response.data;
  };

  public getArtistTopTracks = async (
    id: string,
    market?: string
  ): Promise<ArtistTopTracksResponse> => {
    const response = await this.tryWithToken<ArtistTopTracksResponse>(
      async () =>
        await this.httpClient.get(`/artists/${id}/top-tracks`, {
          params: {
            market,
          },
        })
    );

    return response.data;
  };

  public getAlbumTracks = async (
    id: string,
    options?: CombinedOptions
  ): Promise<AlbumTracksResponse> => {
    const response = await this.tryWithToken<AlbumTracksResponse>(
      async () =>
        await this.httpClient.get(`/albums/${id}/tracks`, {
          params: options,
        })
    );

    return response.data;
  };

  public getTrack = async (
    id: string,
    options?: MarketOptions
  ): Promise<Track> => {
    const response = await this.tryWithToken<Track>(
      async () =>
        await this.httpClient.get(`/tracks/${id}`, {
          params: options,
        })
    );

    return response.data;
  };

  public getArtist = async (id: string): Promise<FullArtist> => {
    const response = await this.tryWithToken<FullArtist>(
      async () => await this.httpClient.get(`/artists/${id}`)
    );

    return response.data;
  };

  public getMyDevices = async (): Promise<UserDevicesResponse> => {
    const response = await this.tryWithToken<UserDevicesResponse>(
      async () => await this.httpClient.get(`/me/player/devices`)
    );

    return response.data;
  };

  public pause = async (options?: DeviceOptions): Promise<void> => {
    await this.tryWithToken<UserDevicesResponse>(
      async () =>
        await this.httpClient.put(`/me/player/pause`, {
          params: options,
        })
    );
  };

  public play = async (options?: PlayOptions): Promise<void> => {
    // eslint-disable-next-line camelcase
    const device_id = options.device_id;
    delete options['device_id'];

    await this.tryWithToken<UserDevicesResponse>(
      async () =>
        await this.httpClient.put(`/me/player/play`, options, {
          params: {
            // eslint-disable-next-line camelcase
            device_id,
          },
        })
    );
  };

  public addToQueue = async (
    uri: string,
    options?: DeviceOptions
  ): Promise<void> => {
    await this.tryWithToken<UserDevicesResponse>(
      async () =>
        await this.httpClient.post(`/me/player/queue`, {
          params: {
            uri,
            ...options,
          },
        })
    );
  };

  public next = async (options?: DeviceOptions): Promise<void> => {
    await this.tryWithToken<UserDevicesResponse>(
      async () =>
        await this.httpClient.post(`/me/player/next`, {
          params: options,
        })
    );
  };

  public previous = async (options?: DeviceOptions): Promise<void> => {
    await this.tryWithToken<UserDevicesResponse>(
      async () =>
        await this.httpClient.post(`/me/player/previous`, {
          params: options,
        })
    );
  };
}
