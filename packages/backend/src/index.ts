import { ConnectionOptions, createConnection } from 'typeorm';

import App from './App';
import Playlist from './entities/Playlist';
import PlaylistService from './services/PlaylistService';
import SpotifyPlayerService from './services/SpotifyPlayerService';
import SpotifyWebApi from 'spotify-web-api-node';
import Track from './entities/Track';

export const spotifyApi = new SpotifyWebApi({
  clientId: '82cee3b12c81432bb0fc7efddffd94d4',
  clientSecret: '88d72d2562cb41afa7c7f05c1fbd6cbb',
  redirectUri: 'http://localhost:8080/api/callback',
});

export const spotifyPlayerService = new SpotifyPlayerService(
  spotifyApi,
  'SpoddifyMopped'
);

export const playlistService = new PlaylistService(spotifyApi);

const databaseConnectionOptions: ConnectionOptions = {
  database: 'database.sqlite',
  entities: [Track, Playlist],
  synchronize: true,
  type: 'better-sqlite3',
};

createConnection(databaseConnectionOptions)
  .then(() => {
    const app = new App(8080);
    app.listen();
  })
  .catch((error) => console.error('TypeORM connection error: ', error.message));
