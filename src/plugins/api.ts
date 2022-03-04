import Player, { PlayerState } from '../player/player';
import PlaylistService, { FullPlaylist } from '../services/playlist';

import Logger from '../logger/logger';
import Playlist from '../db/playlist';

export default class PluginApi {
  public constructor(
    private readonly player: Player,
    private readonly playlistService: PlaylistService
  ) {}

  /*
    Logger
  */

  public getLogger = (name: string): Logger => {
    return Logger.create(`Plugin:${name}`);
  };

  /*
    Spotify player service api
  */

  public getPlayer = async (): Promise<PlayerState | undefined> => {
    return await this.player.getPlayer();
  };

  public playPause = async (): Promise<void> => {
    await this.player.playPause();
  };

  public next = async (): Promise<void> => {
    await this.player.next();
  };

  public previous = async (): Promise<void> => {
    await this.player.previous();
  };

  public seek = async (position: number): Promise<void> => {
    await this.player.seek(position);
  };

  public play = async (uris?: string[]): Promise<void> => {
    await this.player.play(uris);
  };

  public pause = async (): Promise<void> => {
    await this.player.pause();
  };

  public setVolume = async (volume: number): Promise<void> => {
    await this.player.setVolume(volume);
  };

  public onPlayerUpdate = (listener: (player: PlayerState) => void): void => {
    this.player.onPlayerUpdate(listener);
  };

  /*
    Playlist service api
  */

  public sortInTrackToPlaylist = async (
    spotifyTrackId: string
  ): Promise<void> => {
    await this.playlistService.sortInTrack(spotifyTrackId);
  };

  public sortInAlbumToPlaylist = async (
    spotifyAlbumId: string
  ): Promise<void> => {
    await this.playlistService.sortInAlbum(spotifyAlbumId);
  };

  public getPlaylists = async (): Promise<Playlist[]> => {
    return await this.playlistService.getPlaylists();
  };

  public getPlaylist = async (id: number): Promise<FullPlaylist> => {
    return await this.playlistService.getPlaylist(id);
  };

  public playPlaylist = async (id: number): Promise<void> => {
    await this.playlistService.playPlaylist(id);
  };
}
