import { Device, Player } from '../clients/spotify/types/player';

import SpotifyClient from '../clients/spotify/spotify';

export class DeviceNotFoundError extends Error {}

export default class SpotifyPlayerService {
  private targetDevice?: Device;

  private playerState?: Player;

  public constructor(
    private readonly spotifyClient: SpotifyClient,
    private readonly deviceName: string
  ) {}

  private findTargetDevice = async (): Promise<Device> => {
    const spotifyDeviceResponse = await this.spotifyClient.getMyDevices();

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

    const spotifyPlayerResponse = await this.spotifyClient.getPlayer();

    if (!spotifyPlayerResponse) {
      return this.playerState;
    }

    if (spotifyPlayerResponse.device.id !== this.targetDevice.id) {
      if (!this.playerState) {
        return undefined;
      }

      return this.playerState;
    }

    this.playerState = spotifyPlayerResponse;

    return spotifyPlayerResponse;
  };

  public playPause = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    const player = await this.getPlayer();

    if (player?.is_playing) {
      await this.spotifyClient.pause({
        // eslint-disable-next-line camelcase
        device_id: this.targetDevice.id,
      });
      return;
    }

    await this.spotifyClient.play({
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };

  public next = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.next({
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };

  public previous = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.previous({
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };

  public seek = async (position: number): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.seek(position, {
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };

  public play = async (uris: string[] = []): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.play({
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
      uris,
    });
  };

  public pause = async (): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.pause({
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };

  public addQueue = async (uri: string): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.addToQueue(uri, {
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };

  public setVolume = async (volume: number): Promise<void> => {
    if (!this.targetDevice) {
      this.targetDevice = await this.findTargetDevice();
    }

    await this.spotifyClient.setVolume(volume, {
      // eslint-disable-next-line camelcase
      device_id: this.targetDevice.id,
    });
  };
}
