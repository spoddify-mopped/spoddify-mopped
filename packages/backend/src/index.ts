import { ConnectionOptions, createConnection } from 'typeorm';

import App from './app';
import Logger from './logger/logger';
import Playlist from './db/playlist';
import PlaylistService from './services/playlist';
import SpotifyAuth from './db/spotify_auth';
import SpotifyClient from './clients/spotify/spotify';
import SpotifyPlayerService from './services/player';
import SpotifySearchService from './services/search';
import { SpotifydService } from './services/spotifyd';
import SystemService from './services/system';
import Track from './db/track';
import { TracksToPlaylists } from './db/tracks_to_playlists';
import config from 'nconf';
import initializeConfig from './config/config';

initializeConfig();

Logger.setVerbose(true);

const LOGGER = Logger.create(__filename);

LOGGER.info(`Starting SpoddifyMopped on PID: ${process.pid}`);
LOGGER.info(`Running on node: ${process.version}`);

const spotifyClient = new SpotifyClient({
  clientId: config.get('spotify:clientId'),
  clientSecret: config.get('spotify:clientSecret'),
  redirectUri: `${config.get('spotify:redirectBaseUri')}/api/callback`,
});

const spotifyPlayerService = new SpotifyPlayerService(
  spotifyClient,
  config.get('app:name')
);

const playlistService = new PlaylistService(
  spotifyClient,
  spotifyPlayerService
);
const spotifySearchService = new SpotifySearchService(spotifyClient);

const systemService = new SystemService(spotifyClient);

const databaseConnectionOptions: ConnectionOptions = {
  database: `${config.get('server:dataPath')}/database.sqlite`,
  entities: [Track, Playlist, SpotifyAuth, TracksToPlaylists],
  synchronize: true,
  type: 'sqlite',
};

const spotifydService = new SpotifydService(
  spotifyClient,
  config.get('spotifyd:enabled'),
  {
    backend: config.get('spotifyd:backend'),
    bitrate: '320',
    deviceName: config.get('app:name'),
    deviceType: 'speaker',
  },
  config.get('spotifyd:path')
);

createConnection(databaseConnectionOptions)
  .then(async () => {
    const spotifyAuth = await SpotifyAuth.findOne({ tokenType: 'refresh' });

    if (spotifyAuth) {
      spotifyClient.setRefreshToken(spotifyAuth.tokenValue);

      await spotifydService.start();
    }

    const app = new App(
      playlistService,
      spotifyClient,
      spotifydService,
      spotifyPlayerService,
      spotifySearchService,
      systemService
    );

    app.listen(config.get('server:port'));
  })
  .catch((error) => LOGGER.error('TypeORM connection error: ', error.message));
