import {
  AlbumTracksResponse,
  ArtistResponse,
  TrackResponse,
  TracksResponse,
} from '../../clients/spotify/responses';
import SpotifyPlayerService, { SpotifyApiError } from '../../services/player';
import { createConnection, getConnection } from 'typeorm';

import Playlist from '../../entities/playlist';
import { PlaylistNotFoundError } from './../../services/playlist';
import PlaylistService from '../../services/playlist';
import SpotifyClient from '../../clients/spotify/spotify';
import Track from '../../entities/track';

/* eslint-disable camelcase */

export const spotifyArtist: ArtistResponse = {
  external_urls: undefined,
  followers: undefined,
  genres: ['pop', 'rock'],
  href: '',
  id: 'some artist id',
  images: [],
  name: 'some name',
  type: 'artist',
  uri: '',
};

export const spotifyTrack: TrackResponse = {
  album: undefined,
  artists: [spotifyArtist],
  available_markets: [],
  disc_number: 0,
  duration_ms: 0,
  explicit: false,
  external_ids: undefined,
  external_urls: undefined,
  href: '',
  id: 'some track id',
  is_local: false,
  is_playable: true,
  name: 'some name',
  popularity: 0,
  preview_url: '',
  restrictions: undefined,
  track_number: 0,
  type: 'track',
  uri: '',
};

const spotifyAlbumTracks: AlbumTracksResponse = {
  href: '',
  items: [spotifyTrack, spotifyTrack],
  limit: 30,
  next: '',
  offset: 5,
  total: 30,
};

const spotifyTracks: TracksResponse = {
  tracks: [spotifyTrack],
};

afterEach(() => {
  jest.resetAllMocks();
});

const connectDB = async () => {
  await createConnection({
    database: `:memory:`,
    dropSchema: true,
    entities: [Track, Playlist],
    logging: false,
    synchronize: true,
    type: 'sqlite',
  });
};

const closeDB = async () => {
  await getConnection().close();
};

const spotifyClientMock = new SpotifyClient(null);

describe('sortInTrack', () => {
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await closeDB();
  });

  it('sorts in a new track into new playlists successfully', async () => {
    const getTrackSpy = jest.spyOn(spotifyClientMock, 'getTrack');
    getTrackSpy.mockResolvedValue(spotifyTrack);
    const getArtistSpy = jest.spyOn(spotifyClientMock, 'getArtist');
    getArtistSpy.mockResolvedValue(spotifyArtist);

    const playlistService = new PlaylistService(spotifyClientMock, null);

    await playlistService.sortInTrack('some track id');

    const trackInDb = await Track.findOne();
    expect(trackInDb.id).toBe('some track id');

    const playlistsInDb = await Playlist.find();
    expect(playlistsInDb.length).toBe(2);
    expect(playlistsInDb[0].name).toBe('pop');
    expect(playlistsInDb[1].name).toBe('rock');
  });

  it('sorts in a new track into existing playlists successfully', async () => {
    const getTrackSpy = jest.spyOn(spotifyClientMock, 'getTrack');
    getTrackSpy.mockResolvedValue(spotifyTrack);
    const getArtistSpy = jest.spyOn(spotifyClientMock, 'getArtist');
    getArtistSpy.mockResolvedValue(spotifyArtist);

    const playlistService = new PlaylistService(spotifyClientMock, null);

    const newPlaylist = new Playlist();
    newPlaylist.name = 'pop';
    newPlaylist.createdAt = 1;
    newPlaylist.updatedAt = 1;
    await newPlaylist.save();

    await playlistService.sortInTrack('some track id');

    const trackInDb = await Track.findOne();
    expect(trackInDb.id).toBe('some track id');

    const playlistsInDb = await Playlist.find();
    expect(playlistsInDb.length).toBe(2);

    expect(playlistsInDb[0].name).toBe('pop');
    expect(playlistsInDb[0].createdAt).toBe(newPlaylist.createdAt);
    expect(playlistsInDb[0].updatedAt).not.toBe(newPlaylist.updatedAt);

    expect(playlistsInDb[1].name).toBe('rock');
  });

  it('throws SpotifyApiError on error communicating with the spotify api', async () => {
    const getTrackSpy = jest.spyOn(spotifyClientMock, 'getTrack');
    getTrackSpy.mockRejectedValue(new Error('some error'));

    const playlistService = new PlaylistService(spotifyClientMock, null);

    await expect(playlistService.sortInTrack('some track id')).rejects.toThrow(
      new SpotifyApiError()
    );
  });
});

describe('sortInAlbum', () => {
  it('throws SpotifyApiError on error communicating with the spotify api', async () => {
    const getAlbumTracksSpy = jest.spyOn(spotifyClientMock, 'getAlbumTracks');
    getAlbumTracksSpy.mockRejectedValue(new Error('some error'));

    const playlistService = new PlaylistService(spotifyClientMock, null);

    await expect(playlistService.sortInAlbum('some album id')).rejects.toThrow(
      new SpotifyApiError()
    );
  });

  it('sorts in all album tracks successfully', async () => {
    const getAlbumTracksSpy = jest.spyOn(spotifyClientMock, 'getAlbumTracks');
    getAlbumTracksSpy.mockResolvedValue(spotifyAlbumTracks);

    const playlistService = new PlaylistService(spotifyClientMock, null);

    const sortInTrackSpy = jest
      .spyOn(playlistService, 'sortInTrack')
      .mockResolvedValue();

    await playlistService.sortInAlbum('some album id');

    expect(sortInTrackSpy).toBeCalledTimes(2);
    expect(sortInTrackSpy).toBeCalledWith('some track id');
  });
});

describe('getPlaylists', () => {
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await closeDB();
  });

  it('returns empty array', async () => {
    const playlistService = new PlaylistService(spotifyClientMock, null);

    const playlists = await playlistService.getPlaylists();

    expect(playlists.length).toBe(0);
  });

  it('returns array of playlists', async () => {
    const playlistService = new PlaylistService(spotifyClientMock, null);

    const newPlaylist = new Playlist();
    newPlaylist.name = 'pop';
    newPlaylist.createdAt = 1;
    newPlaylist.updatedAt = 1;
    await newPlaylist.save();

    const playlists = await playlistService.getPlaylists();
    expect(playlists.length).toBe(1);
    expect(playlists[0].name).toBe('pop');
  });
});

describe('getPlaylist', () => {
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await closeDB();
  });

  it('returns playlist with tracks', async () => {
    const getAlbumTracksSpy = jest.spyOn(spotifyClientMock, 'getTracks');
    getAlbumTracksSpy.mockResolvedValue(spotifyTracks);

    const playlistService = new PlaylistService(spotifyClientMock, null);

    const newTrack = new Track();
    newTrack.id = 'some track id';
    await newTrack.save();

    const newPlaylist = new Playlist();
    newPlaylist.id = 1;
    newPlaylist.name = 'pop';
    newPlaylist.createdAt = 1;
    newPlaylist.updatedAt = 1;
    newPlaylist.tracks = [newTrack];
    await newPlaylist.save();

    const playlist = await playlistService.getPlaylist(1);

    expect(playlist.name).toBe('pop');
    expect(playlist.tracks.length).toBe(1);
    expect(playlist.tracks[0].name).toBe('some name');
  });

  it('throws PlaylistNotFoundError when playlist could not be found', async () => {
    const getAlbumTracksSpy = jest.spyOn(spotifyClientMock, 'getTracks');
    getAlbumTracksSpy.mockResolvedValue(spotifyTracks);

    const playlistService = new PlaylistService(spotifyClientMock, null);

    await expect(playlistService.getPlaylist(1)).rejects.toThrow(
      new PlaylistNotFoundError()
    );
  });
});

describe('playPlaylist', () => {
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await closeDB();
  });

  it('plays a playlist', async () => {
    const spotifyPlayerServiceMock = new SpotifyPlayerService(
      spotifyClientMock,
      'some device name'
    );

    const playSpy = jest
      .spyOn(spotifyPlayerServiceMock, 'play')
      .mockResolvedValue();

    const playlistService = new PlaylistService(null, spotifyPlayerServiceMock);

    const newTrack = new Track();
    newTrack.id = 'some track id';
    await newTrack.save();

    const newTrack2 = new Track();
    newTrack2.id = 'some track id 2';
    await newTrack2.save();

    const newPlaylist = new Playlist();
    newPlaylist.id = 1;
    newPlaylist.name = 'pop';
    newPlaylist.createdAt = 1;
    newPlaylist.updatedAt = 1;
    newPlaylist.tracks = [newTrack, newTrack2];
    await newPlaylist.save();

    await playlistService.playPlaylist(1);

    expect(playSpy).toBeCalledWith(
      expect.arrayContaining([
        'spotify:track:some track id',
        'spotify:track:some track id 2',
      ])
    );
  });

  it('throws PlaylistNotFoundError when playlist could not be found', async () => {
    const spotifyPlayerServiceMock = new SpotifyPlayerService(
      spotifyClientMock,
      'some device name'
    );

    const playSpy = jest
      .spyOn(spotifyPlayerServiceMock, 'play')
      .mockResolvedValue();

    const playlistService = new PlaylistService(null, spotifyPlayerServiceMock);

    await expect(playlistService.playPlaylist(1)).rejects.toThrow(
      new PlaylistNotFoundError()
    );
    expect(playSpy).not.toBeCalled();
  });
});
