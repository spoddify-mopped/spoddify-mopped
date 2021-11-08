import { spotifyApi } from "./../index";
import express from "express";

export default class PlayerController {
  public path = "";
  public router = express.Router();

  private targetDevice: SpotifyApi.UserDevice;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/player`, this.getPlayer);
    this.router.post(`${this.path}/pause`, this.pause);
    this.router.post(`${this.path}/forwards`, this.forwards);
    this.router.post(`${this.path}/previous`, this.previous);
    this.router.post(`${this.path}/play`, this.play);
    this.router.post(`${this.path}/queue`, this.queue);
    this.router.get(`${this.path}/search`, this.search);
  }

  private getPlayer = (
    _request: express.Request,
    response: express.Response
  ): void => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((spotifyResponse) => {
        response.send(spotifyResponse.body);
      })
      .catch((error) => {
        response.send(error);
      });
  };

  private pause = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    if (!this.targetDevice) {
      await this.findDevice();
    }
    spotifyApi.getMyCurrentPlaybackState().then((promise) => {
      if (promise.body.is_playing) {
        spotifyApi.pause({
          device_id: this.targetDevice.id,
        });
      } else {
        spotifyApi.play({
          device_id: this.targetDevice.id,
        });
      }
    });

    response.sendStatus(204);
  };

  private forwards = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    spotifyApi.skipToNext();
    response.sendStatus(204);
  };

  private previous = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    spotifyApi.skipToPrevious();
    response.sendStatus(204);
  };

  private play = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    if (this.targetDevice == null) {
        await this.findDevice();
    }
    const uri = request.query["uri"] as string;
    spotifyApi.play({
        device_id: this.targetDevice.id,
        uris: [uri]
    })

    response.sendStatus(204);
  }

  private queue = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    if (this.targetDevice == null) {
        await this.findDevice();
    }
    const uri = request.query["uri"] as string;
    spotifyApi.addToQueue(uri, {
        device_id: this.targetDevice.id
    })

    response.sendStatus(204);
  }

  private search = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const query = request.query["query"] as string;
    spotifyApi.searchTracks(query).then((spotifyResponse) => {
        response.send(spotifyResponse.body);
    });
  }

  private findDevice = async (): Promise<SpotifyApi.UserDevice> => {
    const devices = await spotifyApi.getMyDevices();
    for (const device of devices.body.devices) {
      if (device.name === "Spotifyd@david-arch") {
        this.targetDevice = device;
        return device;
      }
    }
  };
}
