import SpotifyClient from '../clients/spotify/spotify';

export default class SystemService {
  private spotifyClient: SpotifyClient;

  public constructor(spotifyClient: SpotifyClient) {
    this.spotifyClient = spotifyClient;
  }

  public isReady = (): boolean => {
    return !!this.spotifyClient.getRefreshToken();
  };
}
