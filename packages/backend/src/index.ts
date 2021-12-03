import { ConnectionOptions, createConnection } from 'typeorm';

import App from './App';
import Playlist from './entities/Playlist';
import PlaylistService from './services/PlaylistService';
import SpotifyPlayerService from './services/SpotifyPlayerService';
import SpotifyWebApi from 'spotify-web-api-node';
import Track from './entities/Track';

export const spotifyApi = new SpotifyWebApi({
  clientId: 'd6d7c9814a064d51b3cedebdb6dd2275',
  clientSecret: 'f4eda3c7b0584cafa20aa6d448a4c60f',
  redirectUri: 'http://localhost:8080/callback',
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
