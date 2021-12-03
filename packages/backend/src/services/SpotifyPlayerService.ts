import SpotifyWebApi from 'spotify-web-api-node';

export class DeviceNotFoundError extends Error {}
export class SpotifyApiError extends Error {}

export default class SpotifyPlayerService {
  private spotifyApiClient: SpotifyWebApi;
  private deviceName: string;

  private targetDevice?: SpotifyApi.UserDevice;

  public constructor(spotifyApiClient: SpotifyWebApi, deviceName: string) {
    this.spotifyApiClient = spotifyApiClient;
    this.deviceName = deviceName;
  }

  private findTargetDevice = async (): Promise<SpotifyApi.UserDevice> => {
    let spotifyDeviceResponse: SpotifyApi.UserDevicesResponse;

    try {
      spotifyDeviceResponse = (await this.spotifyApiClient.getMyDevices()).body;
    } catch (error) {
      throw new SpotifyApiError();
    }

    const device = spotifyDeviceResponse.devices.find(
      (device) => device.name === this.deviceName
    );

    if (device) {
      return device;
    } else {
      throw new DeviceNotFoundError();
    }
  };

  public getPlayer = async (): Promise<SpotifyApi.CurrentPlaybackResponse> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    let spotifyPlayerResponse: SpotifyApi.CurrentPlaybackResponse;

    try {
      spotifyPlayerResponse = (
        await this.spotifyApiClient.getMyCurrentPlaybackState()
      ).body;
    } catch (error) {
      throw new SpotifyApiError();
    }

    if (spotifyPlayerResponse.device.id !== this.targetDevice.id) {
      throw new DeviceNotFoundError();
    }

    return spotifyPlayerResponse;
  };

  public playPause = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    const player = await this.getPlayer();

    try {
      if (player.is_playing) {
        await this.spotifyApiClient.pause({
          // eslint-disable-next-line camelcase
          device_id: this.targetDevice.id,
        });
      } else {
        await this.spotifyApiClient.play({
          // eslint-disable-next-line camelcase
          device_id: this.targetDevice.id,
        });
      }
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public next = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyApiClient.skipToNext({
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public previous = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyApiClient.skipToPrevious({
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public play = async (uris: string[] = []): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyApiClient.play({
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
        uris,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public pause = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyApiClient.pause({
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public addQueue = async (uri: string): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyApiClient.addToQueue(uri, {
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };
}
