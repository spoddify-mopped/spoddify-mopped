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

  private searchController: SearchController;
  private playlistController: PlaylistController;
  private playerController: PlayerController;
  private eventController: EventController;
  private authController: AuthController;

  public constructor(
    spotifySearchService: SpotifySearchService,
    playlistService: PlaylistService,
    spotifyPlayerService: SpotifyPlayerService,
    spotifyClient: SpotifyClient
  ) {
    this.app = express();
    this.server = http.createServer(this.app);

    this.initializeSocketIo(spotifyClient);

    this.searchController = new SearchController(spotifySearchService);
    this.playlistController = new PlaylistController(playlistService);
    this.playerController = new PlayerController(spotifyPlayerService);
    this.eventController = new EventController(this.websocketHandler);
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

  private initializeSocketIo(spotifyClient: SpotifyClient): void {
    this.io = new Server(this.server, {
      cors: socketIoCors,
    });

    this.websocketHandler = new WebsocketHandler(spotifyClient, this.io);

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
