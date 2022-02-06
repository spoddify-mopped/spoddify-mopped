/* eslint-disable camelcase */

import {
  AlbumTracksResponse,
  ArtistResponse,
  SearchResponse,
  TrackResponse,
  TracksResponse,
  UserDevicesResponse,
} from './../../../clients/spotify/responses';
import axios, { AxiosError } from 'axios';

import SpotifyClient from '../../../clients/spotify/spotify';

const testConfig = {
  clientId: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
  redirectUri: 'http://localhost:8080/cb',
};

beforeEach(() => {
  /*
  Make axios `create` return the default axios instance.
  So further calls can be mocked.
   */
  jest.spyOn(axios, 'create').mockImplementation(() => axios);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getOAuthUrl', () => {
  it('returns the correct authorization url with no scopes', () => {
    const spotifyClient = new SpotifyClient(testConfig);

    const expectedUrl =
      'https://accounts.spotify.com/authorize?client_id=CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcb&response_type=code';

    const url = spotifyClient.getOAuthUrl([]);

    expect(url).toBe(expectedUrl);
  });

  it('returns the correct authorization url with one scope', () => {
    const spotifyClient = new SpotifyClient(testConfig);

    const expectedUrl =
      'https://accounts.spotify.com/authorize?client_id=CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcb&response_type=code&scope=SCOPE_1';

    const url = spotifyClient.getOAuthUrl(['SCOPE_1']);

    expect(url).toBe(expectedUrl);
  });

  it('returns the correct authorization url with multiple scopes', () => {
    const spotifyClient = new SpotifyClient(testConfig);

    const expectedUrl =
      'https://accounts.spotify.com/authorize?client_id=CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcb&response_type=code&scope=SCOPE_1%20SCOPE_2%20SCOPE_3';

    const url = spotifyClient.getOAuthUrl(['SCOPE_1', 'SCOPE_2', 'SCOPE_3']);

    expect(url).toBe(expectedUrl);
  });
});

describe('authorizationCodeGrant', () => {
  it('returns a token pair for a valid request', async () => {
    const expectedResponse = {
      access_token: 'ACCESS_TOKEN',
      expires_in: 3600,
      refresh_token: 'REFRESH_TOKEN',
      scope: 'SCOPE',
      token_type: 'Bearer',
    };

    const expectedParams = new URLSearchParams();
    expectedParams.append('grant_type', 'authorization_code');
    expectedParams.append('code', 'CODE');
    expectedParams.append('client_id', testConfig.clientId);
    expectedParams.append('client_secret', testConfig.clientSecret);
    expectedParams.append('redirect_uri', testConfig.redirectUri);

    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.authorizationCodeGrant('CODE');

    expect(axiosSpy).toBeCalledWith(
      'https://accounts.spotify.com/api/token',
      expectedParams
    );

    expect(response).toBe(expectedResponse);
  });

  it('throws custom error on unexpected non failure status code', async () => {
    const expectedParams = new URLSearchParams();
    expectedParams.append('grant_type', 'authorization_code');
    expectedParams.append('code', 'CODE');
    expectedParams.append('client_id', testConfig.clientId);
    expectedParams.append('client_secret', testConfig.clientSecret);
    expectedParams.append('redirect_uri', testConfig.redirectUri);

    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);

    await expect(
      spotifyClient.authorizationCodeGrant('CODE')
    ).rejects.toThrowError(new Error(`Unexpected status code: 204`));

    expect(axiosSpy).toBeCalledWith(
      'https://accounts.spotify.com/api/token',
      expectedParams
    );
  });
});

describe('requestRefreshedToken', () => {
  it('returns a access token for a valid request', async () => {
    const expectedResponse = {
      access_token: 'ACCESS_TOKEN',
      expires_in: 3600,
      scope: 'SCOPE',
      token_type: 'Bearer',
    };

    const expectedParams = new URLSearchParams();
    expectedParams.append('grant_type', 'refresh_token');
    expectedParams.append('refresh_token', 'REFRESH_TOKEN');
    expectedParams.append('client_id', testConfig.clientId);
    expectedParams.append('client_secret', testConfig.clientSecret);

    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.requestRefreshedToken('REFRESH_TOKEN');

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith(
      'https://accounts.spotify.com/api/token',
      expectedParams
    );
  });

  it('throws custom error on unexpected non failure status code', async () => {
    const expectedParams = new URLSearchParams();
    expectedParams.append('grant_type', 'refresh_token');
    expectedParams.append('refresh_token', 'REFRESH_TOKEN');
    expectedParams.append('client_id', testConfig.clientId);
    expectedParams.append('client_secret', testConfig.clientSecret);

    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);

    await expect(
      spotifyClient.requestRefreshedToken('REFRESH_TOKEN')
    ).rejects.toThrowError(new Error(`Unexpected status code: 204`));

    expect(axiosSpy).toBeCalledWith(
      'https://accounts.spotify.com/api/token',
      expectedParams
    );
  });
});

describe('setAccessToken', () => {
  const axiosMock = axios;
  jest.spyOn(axios, 'create').mockImplementation(() => axiosMock);

  const spotifyClient = new SpotifyClient(testConfig);
  spotifyClient.setAccessToken('TOKEN');

  expect(axiosMock.defaults.headers['Authorization']).toBe('Bearer TOKEN');
});

/*
  This tests the internal implementation which refreshes the access token and retries the request
  when the spotify api returned a http status code 401.
  The implementation is used by all following methods which are calling the spotify api with an access token.
  But it is only tested once with the `getPlayer` method.
*/
describe('tryWithToken implementation', () => {
  it('refreshes the access token and retires on http status code 401', async () => {
    const expectedResponse = 'TEST';
    let tries = 1;

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === '/me/player') {
        if (tries === 1) {
          tries++;
          return Promise.reject({
            isAxiosError: true,
            response: {
              status: 401,
            },
          } as AxiosError);
        } else {
          return Promise.resolve({
            data: expectedResponse,
            status: 200,
          });
        }
      }
    });

    const axiosRefreshTokenSpy = jest
      .spyOn(axios, 'post')
      .mockImplementation((url) => {
        if (url === 'https://accounts.spotify.com/api/token') {
          return Promise.resolve({
            data: {
              access_token: 'TOKEN',
            },
            status: 200,
          });
        }
      });

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getPlayer();

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith('/me/player');
    expect(axiosSpy).toBeCalledTimes(2);
    expect(axiosRefreshTokenSpy).toBeCalledTimes(1);
  });

  it('throws on any other error or erroneous status', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 500,
      },
    } as AxiosError;

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url === '/me/player') {
        return Promise.reject(error);
      }
    });

    const axiosRefreshTokenSpy = jest.spyOn(axios, 'post').mockImplementation();
    const spotifyClient = new SpotifyClient(testConfig);

    await expect(spotifyClient.getPlayer()).rejects.toEqual(error);

    expect(axiosSpy).toBeCalledWith('/me/player');
    expect(axiosSpy).toBeCalledTimes(1);
    expect(axiosRefreshTokenSpy).toBeCalledTimes(0);
  });
});

describe('getPlayer', () => {
  it('returns undefined for http status 204', async () => {
    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getPlayer();

    expect(response).toBeUndefined();
    expect(axiosSpy).toBeCalledWith('/me/player');
  });

  it('returns a player response for http status 200', async () => {
    const expectedResponse = {};

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getPlayer();

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith('/me/player');
  });

  it('throws custom error on unexpected non failure status code', async () => {
    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        status: 201,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);

    await expect(spotifyClient.getPlayer()).rejects.toThrowError(
      new Error(`Unexpected status code: 201`)
    );

    expect(axiosSpy).toBeCalledWith('/me/player');
  });
});

describe('getPlayer', () => {
  it('succeeds with the given parameters and a single type', async () => {
    const expectedResponse: SearchResponse = {
      albums: undefined,
      artists: undefined,
      tracks: undefined,
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.search('query', ['track']);

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith('/search', {
      params: {
        q: 'query',
        type: 'track',
      },
    });
  });

  it('succeeds with the given parameters and multiple types', async () => {
    const expectedResponse: SearchResponse = {
      albums: undefined,
      artists: undefined,
      tracks: undefined,
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.search('query', ['track', 'artist']);

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith('/search', {
      params: {
        q: 'query',
        type: 'track,artist',
      },
    });
  });
});

describe('getArtistTopTracks', () => {
  it('succeeds with the given parameters', async () => {
    const expectedResponse: TracksResponse = {
      tracks: [],
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getArtistTopTracks('id', 'DE');

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith(`/artists/id/top-tracks`, {
      params: {
        market: 'DE',
      },
    });
  });
});

describe('getAlbumTracks', () => {
  it('succeeds with the given parameters', async () => {
    const expectedResponse: AlbumTracksResponse = {
      href: '',
      items: [],
      limit: 30,
      next: '',
      offset: 5,
      total: 30,
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getAlbumTracks('id', {
      limit: 30,
      market: 'DE',
      offset: 5,
    });

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith(`/albums/id/tracks`, {
      params: {
        limit: 30,
        market: 'DE',
        offset: 5,
      },
    });
  });
});

describe('getTrack', () => {
  it('succeeds with the given parameters', async () => {
    const expectedResponse: TrackResponse = {
      album: undefined,
      artists: [],
      available_markets: [],
      disc_number: 0,
      duration_ms: 0,
      explicit: false,
      external_ids: undefined,
      external_urls: undefined,
      href: '',
      id: '',
      is_local: false,
      is_playable: true,
      name: '',
      popularity: 0,
      preview_url: '',
      restrictions: undefined,
      track_number: 0,
      type: 'track',
      uri: '',
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getTrack('id', {
      market: 'DE',
    });

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith(`/tracks/id`, {
      params: {
        market: 'DE',
      },
    });
  });
});

describe('getArtist', () => {
  it('succeeds with the given parameters', async () => {
    const expectedResponse: ArtistResponse = {
      external_urls: undefined,
      followers: undefined,
      genres: [],
      href: '',
      id: '',
      images: [],
      name: '',
      type: 'artist',
      uri: '',
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getArtist('id');

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith(`/artists/id`);
  });
});

describe('getMyDevices', () => {
  it('succeeds with the given parameters', async () => {
    const expectedResponse: UserDevicesResponse = {
      devices: [],
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getMyDevices();

    expect(response).toBe(expectedResponse);
    expect(axiosSpy).toBeCalledWith(`/me/player/devices`);
  });
});

describe('pause', () => {
  it('succeeds with the given parameters', async () => {
    const axiosSpy = jest.spyOn(axios, 'put').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    await spotifyClient.pause({
      device_id: 'id',
    });

    expect(axiosSpy).toBeCalledWith(`/me/player/pause`, {
      params: {
        device_id: 'id',
      },
    });
  });
});

describe('play', () => {
  it('succeeds with device_id only', async () => {
    const axiosSpy = jest.spyOn(axios, 'put').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    await spotifyClient.play({
      device_id: 'id',
    });

    expect(axiosSpy).toBeCalledWith(
      `/me/player/play`,
      {},
      {
        params: {
          device_id: 'id',
        },
      }
    );
  });

  it('succeeds with all parameters', async () => {
    const axiosSpy = jest.spyOn(axios, 'put').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const expectedBody = {
      context_uri: '',
      offset: { position: 0 },
      position_ms: 0,
      uris: ['URI'],
    };

    const spotifyClient = new SpotifyClient(testConfig);
    await spotifyClient.play({
      device_id: 'id',
      ...expectedBody,
    });

    expect(axiosSpy).toBeCalledWith(`/me/player/play`, expectedBody, {
      params: {
        device_id: 'id',
      },
    });
  });
});

describe('addToQueue', () => {
  it('succeeds with the given parameters', async () => {
    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    await spotifyClient.addToQueue('URI', {
      device_id: 'id',
    });

    expect(axiosSpy).toBeCalledWith(`/me/player/queue`, {
      params: {
        device_id: 'id',
        uri: 'URI',
      },
    });
  });
});

describe('next', () => {
  it('succeeds with the given parameters', async () => {
    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    await spotifyClient.next({
      device_id: 'id',
    });

    expect(axiosSpy).toBeCalledWith(`/me/player/next`, {
      params: {
        device_id: 'id',
      },
    });
  });
});

describe('previous', () => {
  it('succeeds with the given parameters', async () => {
    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        status: 204,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    await spotifyClient.previous({
      device_id: 'id',
    });

    expect(axiosSpy).toBeCalledWith(`/me/player/previous`, {
      params: {
        device_id: 'id',
      },
    });
  });
});

describe('getTracks', () => {
  it('succeeds with the given parameters', async () => {
    const expectedResponse: TracksResponse = {
      tracks: [],
    };

    const axiosSpy = jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: expectedResponse,
        status: 200,
      })
    );

    const spotifyClient = new SpotifyClient(testConfig);
    const response = await spotifyClient.getTracks(['id1', 'id2']);

    expect(axiosSpy).toBeCalledWith(`/tracks`, {
      params: {
        ids: 'id1,id2',
      },
    });
    expect(response).toBe(expectedResponse);
  });
});
