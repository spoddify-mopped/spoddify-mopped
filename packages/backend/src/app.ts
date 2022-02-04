import AuthController from './controllers/auth';
import EventController from './controllers/event';
import PlayerController from './controllers/player';
import PlaylistController from './controllers/playlist';
import PlaylistService from './services/playlist';
import SearchController from './controllers/search';
import { Server } from 'socket.io';
import SpotifyClient from './clients/spotify/spotify';
import SpotifyPlayerService from './services/player';
import SpotifySearchService from './services/search';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';

const socketIoCors = {
  allowedHeaders: '*',
  methods: '*',
  origin: '*',
};

export default class App {
  private app: express.Application;

  private server: http.Server;
  private io: Server;

  private searchController: SearchController;
  private playlistController: PlaylistController;
  private playerController: PlayerController;
  private eventController: EventController;
  private authController: AuthController;

  private spotifyClient: SpotifyClient;

  public constructor(
    spotifySearchService: SpotifySearchService,
    playlistService: PlaylistService,
    spotifyPlayerService: SpotifyPlayerService,
    spotifyClient: SpotifyClient
  ) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.initializeSocketIo();

    this.spotifyClient = spotifyClient;

    this.searchController = new SearchController(spotifySearchService);
    this.playlistController = new PlaylistController(playlistService);
    this.playerController = new PlayerController(spotifyPlayerService);
    this.eventController = new EventController(this.io, spotifyClient);
    this.authController = new AuthController(spotifyClient);

    this.initializeMiddleware();
    this.initializeControllers();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
  }

  private initializeControllers(): void {
    this.app.use('/api', this.authController.router);
    this.app.use('/api', this.playerController.router);
    this.app.use('/api', this.searchController.router);
    this.app.use('/api', this.eventController.router);
    this.app.use('/api', this.playlistController.router);

    this.app.use(
      '*',
      (_request: express.Request, response: express.Response): void => {
        response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
      }
    );
  }

  private initializeSocketIo(): void {
    this.io = new Server(this.server, {
      cors: socketIoCors,
    });

    this.io.on('connection', (socket) => {
      console.log(`New socket.io connection with id: ${socket.id}`);

      socket.on('action', () => {
        this.spotifyClient.getPlayer().then((data) => {
          this.io.emit('action', {
            payload: {
              album: data.item.album.name,
              artist: data.item.artists.map((artist) => artist.name).join(', '),
              coverUrl: data.item.album.images[0].url,
              duration: data.item.duration_ms,
              isPlaying: data.is_playing,
              progress: data.progress_ms,
              track: data.item.name,
            },
            type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
          });
        });
      });
    });
  }

  public listen(port: number): void {
    this.server.listen(port, () => {
      console.info(`Server is running at http://localhost:${port}`);
    });
  }
}
