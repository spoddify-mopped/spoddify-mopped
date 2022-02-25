import SpotifyClient from '../clients/spotify/spotify';

export default class SystemService {
  public constructor(private readonly spotifyClient: SpotifyClient) {}

  public isReady = (): boolean => {
    return !!this.spotifyClient.getRefreshToken();
  };
}
