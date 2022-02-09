import SpotifyPlayerService from '../../services/player';
import VotingService from '../../services/voting';

afterEach(() => {
  jest.resetAllMocks();
  jest.useRealTimers();
});

describe('addVote', () => {
  it('starts a voting when no voting is running', () => {
    jest.useFakeTimers();
    const setIntervalMock = jest.spyOn(global, 'setInterval');
    const mockSpotifyPlayerService = new SpotifyPlayerService(undefined, '');

    const votingService = new VotingService(mockSpotifyPlayerService);

    votingService.addVote('uuid', true);

    expect(setIntervalMock).toBeCalledTimes(1);
  });

  it('adds an vote to an already started voting', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const mockSpotifyPlayerService = new SpotifyPlayerService(undefined, '');

    const votingService = new VotingService(mockSpotifyPlayerService);

    votingService.addVote('uuid', true);
    votingService.addVote('uuid2', true);
  });

  it('throws an error when uuid has already voted', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const mockSpotifyPlayerService = new SpotifyPlayerService(undefined, '');

    const votingService = new VotingService(mockSpotifyPlayerService);

    votingService.addVote('uuid', true);

    expect(() => votingService.addVote('uuid', true)).toThrowError();
  });
});

describe('voting result', () => {
  it('skips', () => {
    jest.useFakeTimers();
    const mockSpotifyPlayerService = new SpotifyPlayerService(undefined, '');
    const nextMock = jest
      .spyOn(mockSpotifyPlayerService, 'next')
      .mockImplementation(() => {
        return Promise.resolve();
      });

    const votingService = new VotingService(mockSpotifyPlayerService);
    votingService.addVote('uuid', true);

    jest.advanceTimersByTime(120000);

    expect(nextMock).toBeCalledTimes(1);
  });

  it('do not skips', () => {
    jest.useFakeTimers();
    const mockSpotifyPlayerService = new SpotifyPlayerService(undefined, '');
    const nextMock = jest.spyOn(mockSpotifyPlayerService, 'next');

    const votingService = new VotingService(mockSpotifyPlayerService);
    votingService.addVote('uuid', false);

    jest.advanceTimersByTime(120000);

    expect(nextMock).toBeCalledTimes(0);
  });
});
