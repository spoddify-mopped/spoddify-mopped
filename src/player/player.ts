import Queue, { QueueItem } from './queue';
import { Track, mapSpotifyTrackToTrack } from '../models/track';

import { EventEmitter } from 'events';
import SpotifyClient from '../clients/spotify/spotify';

export type PlayerState = {
  progress?: number;
  volume: number;
  isPlaying: boolean;
  item: Track;
};

export class DeviceNotFoundError extends Error {}

class Player {
  private targetDeviceId?: string;

  private player?: PlayerState;

  private playlistId?: number;

  private event = new EventEmitter();

  private disallowsSkippingPrev = false;
  private disallowsSkippingNext = false;

  private readonly queue = new Queue();

  public constructor(
    private readonly name: string,
    private readonly spotifyClient: SpotifyClient
  ) {}

  private findTargetDevice = async (): Promise<string> => {
    const spotifyDeviceResponse = await this.spotifyClient.getMyDevices();

    const device = spotifyDeviceResponse.devices.find(
      (device) => device && device.name === this.name
    );

    if (device) {
      return device.id;
    } else {
      throw new DeviceNotFoundError();
    }
  };

  private refreshPlayer = async (): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    const response = await this.spotifyClient.getPlayer();

    if (!response) {
      return;
    }

    if (response.device.id !== this.targetDeviceId) {
      return;
    }

    const playing = this.queue.getPlaying();
    const next = this.queue.getNext();
    const previous = this.queue.getPrevious();

    if (next?.uri === response.item.uri) {
      this.queue.next();
    } else if (previous?.uri === response.item.uri) {
      this.queue.previous();
    } else if (playing?.uri !== response.item.uri) {
      this.playlistId = undefined;
      this.queue.clear();
    }

    this.disallowsSkippingPrev = response.actions.disallows.skipping_prev;
    this.disallowsSkippingNext = response.actions.disallows.skipping_next;

    this.player = {
      isPlaying: response.is_playing,
      item: mapSpotifyTrackToTrack(response.item),
      progress: response.progress_ms,
      volume: response.device.volume_percent,
    };
  };

  public getPlayer = async (): Promise<PlayerState | undefined> => {
    await this.refreshPlayer();
    return this.player;
  };

  public getQueue = (): Array<QueueItem> => this.queue.getQueue();

  public updatePlayer = async (): Promise<boolean> => {
    await this.refreshPlayer();
    return this.event.emit('update', this.player);
  };

  public onPlayerUpdate = (listener: (player: PlayerState) => void): void => {
    this.event.on('update', listener);
  };

  public play = async (
    uris: string[] = [],
    playlistId?: number
  ): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    this.queue.clear();

    uris.map((uri) => {
      this.queue.add(uri);
    });

    await this.spotifyClient.play({
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
      uris,
    });

    this.playlistId = playlistId;
  };

  public playPause = async (): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    if (this.player?.isPlaying) {
      await this.spotifyClient.pause({
        // eslint-disable-next-line camelcase
        device_id: this.targetDeviceId,
      });
      return;
    }

    await this.spotifyClient.play({
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };

  public next = async (): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    if (this.disallowsSkippingNext) {
      return;
    }

    await this.spotifyClient.next({
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };

  public previous = async (): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    if (this.disallowsSkippingPrev) {
      return;
    }

    await this.spotifyClient.previous({
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };

  public seek = async (position: number): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    await this.spotifyClient.seek(position, {
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };

  public pause = async (): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    await this.spotifyClient.pause({
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };

  public addQueue = async (uri: string): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    await this.spotifyClient.addToQueue(uri, {
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };

  public setVolume = async (volume: number): Promise<void> => {
    if (!this.targetDeviceId) {
      this.targetDeviceId = await this.findTargetDevice();
    }

    await this.spotifyClient.setVolume(volume, {
      // eslint-disable-next-line camelcase
      device_id: this.targetDeviceId,
    });
  };
}

export default Player;
