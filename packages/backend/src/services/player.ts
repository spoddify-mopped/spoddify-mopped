import { Player } from '../clients/spotify/types/player';
import SpotifyClient from '../clients/spotify/spotify';

export class DeviceNotFoundError extends Error {}
export class SpotifyApiError extends Error {}

export default class SpotifyPlayerService {
  private spotifyClient: SpotifyClient;
  private deviceName: string;

  private targetDevice?: SpotifyApi.UserDevice;

  public constructor(spotifyClient: SpotifyClient, deviceName: string) {
    this.spotifyClient = spotifyClient;
    this.deviceName = deviceName;
  }

  private findTargetDevice = async (): Promise<SpotifyApi.UserDevice> => {
    let spotifyDeviceResponse: SpotifyApi.UserDevicesResponse;

    try {
      spotifyDeviceResponse = await this.spotifyClient.getMyDevices();
    } catch (error) {
      throw new SpotifyApiError();
    }

    const device = spotifyDeviceResponse.devices.find(
      (device) => device && device.name === this.deviceName
    );

    if (device) {
      return device;
    } else {
      throw new DeviceNotFoundError();
    }
  };

  public getPlayer = async (): Promise<Player | undefined> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    let spotifyPlayerResponse: Player | undefined;

    try {
      spotifyPlayerResponse = await this.spotifyClient.getPlayer();
    } catch (error) {
      throw new SpotifyApiError();
    }

    if (!spotifyPlayerResponse) {
      return spotifyPlayerResponse;
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
        await this.spotifyClient.pause({
          // eslint-disable-next-line camelcase
          device_id: this.targetDevice.id,
        });
      } else {
        await this.spotifyClient.play({
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
      await this.spotifyClient.next({
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
      await this.spotifyClient.previous({
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public seek = async (position: number): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyClient.seek(position, {
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
      await this.spotifyClient.play({
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
      await this.spotifyClient.pause({
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
      await this.spotifyClient.addToQueue(uri, {
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };

  public setVolume = async (volume: number): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    try {
      await this.spotifyClient.setVolume(volume, {
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
    } catch (error) {
      throw new SpotifyApiError();
    }
  };
}
