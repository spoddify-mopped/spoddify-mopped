import SpotifyClient from '../clients/spotify/spotify';

enum ProcessEvents {
  RESTART = 'RESTART_SPODDIFY_MOPPED',
  STOP = 'STOP_SPODDIFY_MOPPED',
}
export default class SystemService {
  public constructor(private readonly spotifyClient: SpotifyClient) {}

  public isReady = (): boolean => {
    return !!this.spotifyClient.getRefreshToken();
  };

  public restart = (): void => {
    process.send(ProcessEvents.RESTART);
  };

  public stop = (): void => {
    process.send(ProcessEvents.STOP);
  };
}
