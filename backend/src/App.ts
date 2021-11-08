import express from "express";
import cors from "cors"
import AuthController from "./controllers/AuthController";
import PlayerController from "./controllers/PlayerController";

export default class App {
    public app: express.Application;
	public port: number;
    
    public constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddleware();
		this.initializeControllers();
    }

    private initializeMiddleware(): void {
        this.app.use(cors());
    }

    private initializeControllers(): void {
        this.app.use('', new AuthController().router);
        this.app.use('', new PlayerController().router);
    }

    public listen(): void {
		this.app.listen(this.port, () => {
			console.info(`Server is running at http://localhost:${this.port}`);
		});
	}


}