import AlbumController from './controllers/album';
import ArtistController from './controllers/artist';
import AuthController from './controllers/auth';
import EventController from './controllers/event';
import Logger from './logger/logger';
import PlayerController from './controllers/player';
import PlaylistController from './controllers/playlist';
import PlaylistService from './services/playlist';
import SearchController from './controllers/search';
import { Server } from 'socket.io';
import SpotifyClient from './clients/spotify/spotify';
import SpotifyPlayerService from './services/player';
import SpotifySearchService from './services/search';
import SystemController from './controllers/system';
import SystemMiddleware from './middleware/system';
import SystemService from './services/system';
import WebsocketHandler from './ws/handler';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';

const LOGGER = Logger.create(__filename);

const socketIoCors = {
  allowedHeaders: '*',
  methods: '*',
  origin: '*',
};

export default class App {
  private app: express.Application;

  private server: http.Server;
  private io: Server;

  private websocketHandler: WebsocketHandler;

  private systemMiddleware: SystemMiddleware;

  private albumController: AlbumController;
  private artistController: ArtistController;
  private authController: AuthController;
  private eventController: EventController;
  private playerController: PlayerController;
  private playlistController: PlaylistController;
  private searchController: SearchController;
  private systemController: SystemController;

  public constructor(
    spotifySearchService: SpotifySearchService,
    playlistService: PlaylistService,
    spotifyPlayerService: SpotifyPlayerService,
    spotifyClient: SpotifyClient,
    systemService: SystemService
  ) {
    this.app = express();
    this.server = http.createServer(this.app);

    this.initializeSocketIo(spotifyPlayerService, systemService);

    this.systemMiddleware = new SystemMiddleware(systemService);

    this.albumController = new AlbumController(spotifySearchService);
    this.artistController = new ArtistController(spotifySearchService);
    this.authController = new AuthController(spotifyClient);
    this.eventController = new EventController(this.websocketHandler);
    this.playerController = new PlayerController(spotifyPlayerService);
    this.playlistController = new PlaylistController(playlistService);
    this.searchController = new SearchController(spotifySearchService);
    this.systemController = new SystemController(systemService);

    this.initializeMiddleware();
    this.initializeControllers();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    this.app.use(this.systemMiddleware.checkReadiness);
  }

  private initializeControllers(): void {
    this.app.use('/api', this.albumController.router);
    this.app.use('/api', this.artistController.router);
    this.app.use('/api', this.authController.router);
    this.app.use('/api', this.eventController.router);
    this.app.use('/api', this.playerController.router);
    this.app.use('/api', this.playlistController.router);
    this.app.use('/api', this.searchController.router);
    this.app.use('/api', this.systemController.router);

    this.app.use(
      '*',
      (_request: express.Request, response: express.Response): void => {
        response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
      }
    );
  }

  private initializeSocketIo(
    spotifyPlayerService: SpotifyPlayerService,
    systemService: SystemService
  ): void {
    this.io = new Server(this.server, {
      cors: socketIoCors,
    });

    this.websocketHandler = new WebsocketHandler(
      systemService,
      spotifyPlayerService,
      this.io
    );

    this.io.on('connection', (socket) => {
      LOGGER.info(`New socket.io connection with id: ${socket.id}`);
      socket.on('action', this.websocketHandler.handle);
    });
  }

  public listen(port: number): void {
    this.server.listen(port, () => {
      LOGGER.info(`Server is running at http://localhost:${port}`);
    });
  }
}
