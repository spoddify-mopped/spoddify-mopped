import { spotifyApi } from "./../index";
import express from "express";

export default class EventController {
  public path = "/event";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.newEvent);
  }

  private newEvent = (
    _request: express.Request,
    response: express.Response
  ): void => {
    console.log("New Event");

    spotifyApi.getMyCurrentPlaybackState().then((spotifyResponse) => {
		console.log(spotifyResponse.body)
	});

    response.sendStatus(204);
  };
}
