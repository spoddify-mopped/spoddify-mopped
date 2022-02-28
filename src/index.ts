import { ConnectionOptions, createConnection } from 'typeorm';

import App from './app';
import Logger from './logger/logger';
import Playlist from './db/playlist';
import PlaylistService from './services/playlist';
import PluginApi from './plugins/api';
import PluginManager from './plugins/manager';
import QueueService from './services/queue';
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
import { program } from 'commander';

export type { PluginApi };

const startTime = Date.now();

initializeConfig();

if (program.opts().verbose) {
  Logger.setVerbose(true);
}

const logger = Logger.create('main');

logger.info(`Starting SpoddifyMopped on PID: ${process.pid}`);
logger.info(`Running on node: ${process.version}`);

const spotifyClient = new SpotifyClient({
  clientId: config.get('spotify:clientId'),
  clientSecret: config.get('spotify:clientSecret'),
  redirectUri: `${config.get('spotify:redirectBaseUri')}/api/callback`,
});

const spotifyPlayerService = new SpotifyPlayerService(
  spotifyClient,
  config.get('app:name')
);

const queueService = new QueueService();

const playlistService = new PlaylistService(
  spotifyClient,
  spotifyPlayerService,
  queueService
);
const spotifySearchService = new SpotifySearchService(spotifyClient);

const systemService = new SystemService(spotifyClient);

const databaseConnectionOptions: ConnectionOptions = {
  database: `${config.get('server:dataPath')}/database.sqlite`,
  entities: [Track, Playlist, SpotifyAuth, TracksToPlaylists],
  synchronize: true,
  type: 'better-sqlite3',
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

const start = async () => {
  try {
    await createConnection(databaseConnectionOptions);
  } catch (error) {
    logger.error('Database connection failed: ', error.message);
    process.exit(1);
  }

  const spotifyAuth = await SpotifyAuth.findOne({ tokenType: 'refresh' });

  if (spotifyAuth) {
    spotifyClient.setRefreshToken(spotifyAuth.tokenValue);

    await spotifydService.start();
  }

  const pluginApi = new PluginApi(spotifyPlayerService, playlistService);

  const app = new App(
    queueService,
    playlistService,
    spotifyClient,
    spotifydService,
    spotifyPlayerService,
    spotifySearchService,
    systemService,
    pluginApi
  );

  const pluginManager = new PluginManager(pluginApi, config.get('plugins'), {
    customPluginPaths: config.get('customPluginPaths'),
  });
  await pluginManager.initializePlugins();

  app.listen(config.get('server:port'));
};

start().finally(() =>
  logger.debug(`SpoddifyMopped started in ${Date.now() - startTime}ms`)
);
