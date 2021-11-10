import express from "express";
import cors from "cors"
import http from 'http';

import { Server } from 'socket.io';

import AuthController from "./controllers/AuthController";
import PlayerController from "./controllers/PlayerController";
import EventController from "./controllers/EventsController";

const socketIoCors = {
    allowedHeaders: "*",
    origin: "*",
    methods: "*"
}
export default class App {
    private app: express.Application;
	private port: number;

    private server: http.Server;
    private io: Server;
    
    public constructor(port: number) {
        this.app = express();
        this.port = port;
        this.server = http.createServer(this.app)


        this.initializeSocketIo();
        this.initializeMiddleware();
		this.initializeControllers();
    }

    private initializeMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeControllers(): void {
        this.app.use('', new AuthController().router);
        this.app.use('', new PlayerController().router);
        this.app.use('', new EventController(this.io).router);
    }

    private initializeSocketIo(): void {
        this.io = new Server(this.server, {
            cors: socketIoCors
        });

        this.io.on("connection", (socket) => {
            console.log(`New socket.io connection with id: ${socket.id}`);
        });
    }

    public listen(): void {
		this.server.listen(this.port, () => {
			console.info(`Server is running at http://localhost:${this.port}`);
		});
	}

}