import {
  AlreadyVotedError,
  NoPlaylistPlayingError,
} from './../../services/voting';

import Player from '../../player/player';
import PlaylistService from '../../services/playlist';
import VotingService from '../../services/voting';

describe('like', () => {
  it('throws NoPlaylistPlayingError when no playlist is playing', async () => {
    const playerMock = new Player('player', null);

    const getPlaylistIdSpy = jest.spyOn(playerMock, 'getPlaylistId');
    getPlaylistIdSpy.mockReturnValue(undefined);

    const votingService = new VotingService(playerMock, null);

    await expect(votingService.like('some uuid')).rejects.toBeInstanceOf(
      NoPlaylistPlayingError
    );
  });

  it('succeeds', async () => {
    const playerMock = new Player('player', null);

    const getPlaylistIdSpy = jest.spyOn(playerMock, 'getPlaylistId');
    getPlaylistIdSpy.mockReturnValue(1);

    const getPlayerSpy = jest.spyOn(playerMock, 'getPlayer');
    getPlayerSpy.mockResolvedValue({
      heights: [],
      isPlaying: false,
      item: {
        artists: [],
        duration: 1000,
        id: 'some id',
        name: 'some name',
      },
      progress: 0,
      volume: 100,
    });

    const playlistServiceMock = new PlaylistService(null, null);
    const likeTrackSpy = jest.spyOn(playlistServiceMock, 'likeTrack');
    likeTrackSpy.mockImplementation(() => undefined);

    const votingService = new VotingService(playerMock, playlistServiceMock);

    await votingService.like('some uuid');

    expect(likeTrackSpy).toBeCalledWith('some id', 1);
  });

  it('throws AlreadyVotedError when id has already voted', async () => {
    const playerMock = new Player('player', null);

    const getPlaylistIdSpy = jest.spyOn(playerMock, 'getPlaylistId');
    getPlaylistIdSpy.mockReturnValue(1);

    const getPlayerSpy = jest.spyOn(playerMock, 'getPlayer');
    getPlayerSpy.mockResolvedValue({
      heights: [],
      isPlaying: false,
      item: {
        artists: [],
        duration: 1000,
        id: 'some id',
        name: 'some name',
      },
      progress: 0,
      volume: 100,
    });

    const playlistServiceMock = new PlaylistService(null, null);
    const likeTrackSpy = jest.spyOn(playlistServiceMock, 'likeTrack');
    likeTrackSpy.mockImplementation(() => undefined);

    const votingService = new VotingService(playerMock, playlistServiceMock);

    await votingService.like('some uuid');

    await expect(votingService.like('some uuid')).rejects.toBeInstanceOf(
      AlreadyVotedError
    );
  });
});

describe('dislike', () => {
  it('throws NoPlaylistPlayingError when no playlist is playing', async () => {
    const playerMock = new Player('player', null);

    const getPlaylistIdSpy = jest.spyOn(playerMock, 'getPlaylistId');
    getPlaylistIdSpy.mockReturnValue(undefined);

    const votingService = new VotingService(playerMock, null);

    await expect(votingService.dislike('some uuid')).rejects.toBeInstanceOf(
      NoPlaylistPlayingError
    );
  });

  it('succeeds', async () => {
    const playerMock = new Player('player', null);

    const getPlaylistIdSpy = jest.spyOn(playerMock, 'getPlaylistId');
    getPlaylistIdSpy.mockReturnValue(1);

    const getPlayerSpy = jest.spyOn(playerMock, 'getPlayer');
    getPlayerSpy.mockResolvedValue({
      heights: [],
      isPlaying: false,
      item: {
        artists: [],
        duration: 1000,
        id: 'some id',
        name: 'some name',
      },
      progress: 0,
      volume: 100,
    });

    const playlistServiceMock = new PlaylistService(null, null);
    const dislikeTrackSpy = jest.spyOn(playlistServiceMock, 'dislikeTrack');
    dislikeTrackSpy.mockImplementation(() => undefined);

    const votingService = new VotingService(playerMock, playlistServiceMock);

    await votingService.dislike('some uuid');

    expect(dislikeTrackSpy).toBeCalledWith('some id', 1);
  });

  it('throws AlreadyVotedError when id has already voted', async () => {
    const playerMock = new Player('player', null);

    const getPlaylistIdSpy = jest.spyOn(playerMock, 'getPlaylistId');
    getPlaylistIdSpy.mockReturnValue(1);

    const getPlayerSpy = jest.spyOn(playerMock, 'getPlayer');
    getPlayerSpy.mockResolvedValue({
      heights: [],
      isPlaying: false,
      item: {
        artists: [],
        duration: 1000,
        id: 'some id',
        name: 'some name',
      },
      progress: 0,
      volume: 100,
    });

    const playlistServiceMock = new PlaylistService(null, null);
    const dislikeTrackSpy = jest.spyOn(playlistServiceMock, 'dislikeTrack');
    dislikeTrackSpy.mockImplementation(() => undefined);

    const votingService = new VotingService(playerMock, playlistServiceMock);

    await votingService.dislike('some uuid');

    await expect(votingService.dislike('some uuid')).rejects.toBeInstanceOf(
      AlreadyVotedError
    );
  });
});
