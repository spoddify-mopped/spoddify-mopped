import AuthController from './controllers/AuthController';
import EventController from './controllers/EventsController';
import PlayerController from './controllers/PlayerController';
import PlaylistController from './controllers/PlaylistController';
import SearchController from './controllers/SearchController';
import { Server } from 'socket.io';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { spotifyApi } from '.';

const socketIoCors = {
  allowedHeaders: '*',
  methods: '*',
  origin: '*',
};

export default class App {
  private app: express.Application;
  private port: number;

  private server: http.Server;
  private io: Server;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);

    this.initializeSocketIo();
    this.initializeMiddleware();
    this.initializeControllers();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
  }

  private initializeControllers(): void {
    this.app.use('/api', new AuthController().router);
    this.app.use('/api', new PlayerController().router);
    this.app.use('/api', new SearchController().router);
    this.app.use('/api', new EventController(this.io).router);
    this.app.use('/api', new PlaylistController().router);

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
        spotifyApi.getMyCurrentPlaybackState().then((spotifyResponse) => {
          this.io.emit('action', {
            payload: {
              album: spotifyResponse.body.item['album'].name,
              artist: spotifyResponse.body.item['artists'][0].name,
              coverUrl: spotifyResponse.body.item['album']['images'][0].url,
              duration: spotifyResponse.body.item.duration_ms,
              isPlaying: spotifyResponse.body.is_playing,
              progress: spotifyResponse.body.progress_ms,
              track: spotifyResponse.body.item.name,
            },
            type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
          });
        });
      });
    });
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.info(`Server is running at http://localhost:${this.port}`);
    });
  }
}
