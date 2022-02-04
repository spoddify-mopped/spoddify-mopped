import { ConnectionOptions, createConnection } from 'typeorm';

import App from './App';
import Playlist from './entities/Playlist';
import PlaylistService from './services/PlaylistService';
import SpotifyAuth from './entities/SpotifyAuth';
import SpotifyClient from './clients/spotify/spotify';
import SpotifyPlayerService from './services/SpotifyPlayerService';
import Track from './entities/Track';

export const spotifyClient = new SpotifyClient({
  clientId: '82cee3b12c81432bb0fc7efddffd94d4',
  clientSecret: '88d72d2562cb41afa7c7f05c1fbd6cbb',
  redirectUri: 'http://localhost:8080/api/callback',
});

export const spotifyPlayerService = new SpotifyPlayerService(
  spotifyClient,
  'SpoddifyMopped'
);

export const playlistService = new PlaylistService(spotifyClient);

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

    const app = new App(8080);
    app.listen();
  })
  .catch((error) => console.error('TypeORM connection error: ', error.message));
