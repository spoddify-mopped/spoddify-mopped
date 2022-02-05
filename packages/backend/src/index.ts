import { ConnectionOptions, createConnection } from 'typeorm';

import App from './app';
import Logger from './logger/logger';
import Playlist from './entities/playlist';
import PlaylistService from './services/playlist';
import SpotifyAuth from './entities/spotify_auth';
import SpotifyClient from './clients/spotify/spotify';
import SpotifyPlayerService from './services/player';
import SpotifySearchService from './services/search';
import Track from './entities/track';

const LOGGER = Logger.create(__filename);

LOGGER.info(`Starting SpoddifyMopped on PID: ${process.pid}`);

const spotifyClient = new SpotifyClient({
  clientId: '82cee3b12c81432bb0fc7efddffd94d4',
  clientSecret: '88d72d2562cb41afa7c7f05c1fbd6cbb',
  redirectUri: 'http://localhost:8080/api/callback',
});

const spotifyPlayerService = new SpotifyPlayerService(
  spotifyClient,
  'SpoddifyMopped'
);

const playlistService = new PlaylistService(
  spotifyClient,
  spotifyPlayerService
);
const spotifySearchService = new SpotifySearchService(spotifyClient);

const databaseConnectionOptions: ConnectionOptions = {
  database: 'database.sqlite',
  entities: [Track, Playlist, SpotifyAuth],
  synchronize: true,
  type: 'sqlite',
};

createConnection(databaseConnectionOptions)
  .then(async () => {
    const spotifyAuth = await SpotifyAuth.findOne({ tokenType: 'refresh' });

    if (spotifyAuth) {
      spotifyClient.setRefreshToken(spotifyAuth.tokenValue);
    }

    const app = new App(
      spotifySearchService,
      playlistService,
      spotifyPlayerService,
      spotifyClient
    );
    app.listen(8080);
  })
  .catch((error) => LOGGER.error('TypeORM connection error: ', error.message));
