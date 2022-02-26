import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import AlbumController from './controllers/album';
import ArtistController from './controllers/artist';
import AuthController from './controllers/auth';
import EventController from './controllers/event';
import Logger from './logger/logger';
import PlayerController from './controllers/player';
import PlaylistController from './controllers/playlist';
import PlaylistService from './services/playlist';
import RequestError from './error/request';
import SearchController from './controllers/search';
import { Server } from 'socket.io';
import SpotifyClient from './clients/spotify/spotify';
import SpotifyPlayerService from './services/player';
import SpotifySearchService from './services/search';
import { SpotifydService } from './services/spotifyd';
import SystemController from './controllers/system';
import SystemMiddleware from './middleware/system';
import SystemService from './services/system';
import WebsocketHandler from './ws/handler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import loggerMiddleware from './middleware/logger';
import path from 'path';
import promBundle from 'express-prom-bundle';
import swaggerUi from 'swagger-ui-express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('../swagger.json');

const socketIoCors = {
  allowedHeaders: [],
  methods: [],
  origin: ['http://localhost:8080', 'http://localhost:3000'],
};

const metricsMiddleware = promBundle({
  bypass: (req) => !req.path.includes('/api') || req.path.includes('/api/docs'),
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  metricsPath: '/api/metrics',
  promClient: {
    collectDefaultMetrics: {},
  },
  urlPathReplacement: '#id',
  urlValueParser: {
    extraMasks: ['^([a-zA-Z0-9]){22}'],
  },
});

export default class App {
  private readonly logger = Logger.create(App.name);

  private app: express.Application;

  private server: http.Server;
  private io: Server;

  private websocketHandler: WebsocketHandler;

  private systemMiddleware: SystemMiddleware;

  public constructor(
    playlistService: PlaylistService,
    spotifyClient: SpotifyClient,
    spotifydService: SpotifydService,
    spotifyPlayerService: SpotifyPlayerService,
    spotifySearchService: SpotifySearchService,
    systemService: SystemService
  ) {
    this.app = express();
    this.server = http.createServer(this.app);

    this.initializeSocketIo(spotifyPlayerService, systemService);

    this.systemMiddleware = new SystemMiddleware(systemService);

    this.initializeMiddleware();
    this.initializeControllers(
      playlistService,
      spotifyClient,
      spotifydService,
      spotifyPlayerService,
      spotifySearchService,
      systemService
    );
  }

  private initializeMiddleware(): void {
    this.app.use(metricsMiddleware);

    this.app.use(
      cors({
        origin: ['http://localhost:8080', 'http://localhost:3000'],
      })
    );

    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            connectSrc: ["'self'", (req) => `ws://${req.headers.host}`],
            defaultSrc: ["'self'"],
            imgSrc: ['https://i.scdn.co', "'self'", 'data:'],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
          },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
          policy: 'cross-origin',
        },
        hsts: false,
      })
    );

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(loggerMiddleware);
    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    this.app.use(this.systemMiddleware.checkReadiness);
  }

  private initializeControllers(
    playlistService: PlaylistService,
    spotifyClient: SpotifyClient,
    spotifydService: SpotifydService,
    spotifyPlayerService: SpotifyPlayerService,
    spotifySearchService: SpotifySearchService,
    systemService: SystemService
  ): void {
    this.app.use('/api', new AlbumController(spotifySearchService).router);
    this.app.use('/api', new ArtistController(spotifySearchService).router);
    this.app.use(
      '/api',
      new AuthController(spotifyClient, spotifydService).router
    );
    this.app.use('/api', new EventController(this.websocketHandler).router);
    this.app.use('/api', new PlayerController(spotifyPlayerService).router);
    this.app.use('/api', new PlaylistController(playlistService).router);
    this.app.use('/api', new SearchController(spotifySearchService).router);
    this.app.use(
      '/api',
      new SystemController(spotifydService, systemService).router
    );

    this.app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, { explorer: true })
    );

    this.app.use(
      '/api/*',
      (_request: express.Request, response: express.Response) => {
        response.sendStatus(StatusCodes.NOT_FOUND);
      }
    );

    this.app.use(
      '/',
      (_request: express.Request, response: express.Response): void => {
        response.sendFile(
          path.join(__dirname, '..', 'public', 'index.html'),
          (err) => {
            if (err) {
              response.sendStatus(StatusCodes.NOT_FOUND);
            }
          }
        );
      }
    );

    this.app.use(this.errorHandler);
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
      this.logger.debug(
        `New socket.io connection with id: ${socket.id} from ${socket.handshake.address}`
      );
      socket.on('action', this.websocketHandler.handle);
    });
  }

  private errorHandler = (
    error: Error,
    _request: express.Request,
    response: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ): void => {
    if (error instanceof RequestError) {
      response.status(error.statusCode).send(error.getErrorResponse());
    } else {
      this.logger.error(error);

      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          new RequestError(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          ).getErrorResponse()
        );
    }
  };

  public listen(port: number): void {
    this.server.listen(port, () => {
      this.logger.info(`Server is running at http://localhost:${port}`);
    });
  }
}
