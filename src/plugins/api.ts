import PlaylistService, { FullPlaylist } from '../services/playlist';

import { EventEmitter } from 'events';
import Logger from '../logger/logger';
import { Player } from '../clients/spotify/types/player';
import Playlist from '../db/playlist';
import SpotifyPlayerService from '../services/player';

declare interface PluginApi {
  /*
    Player events
  */
  on(event: 'player', listener: (player: Player) => void): this;
  emit(event: 'player', player: Player): boolean;
}

class PluginApi extends EventEmitter implements PluginApi {
  public constructor(
    private readonly spotifyPlayerService: SpotifyPlayerService,
    private readonly playlistService: PlaylistService
  ) {
    super();
  }

  /*
    Logger
  */

  public getLogger = (name: string): Logger => {
    return Logger.create(`Plugin:${name}`);
  };

  /*
    Spotify player service api
  */

  public getPlayer = async (): Promise<Player | undefined> => {
    return await this.spotifyPlayerService.getPlayer();
  };

  public playPause = async (): Promise<void> => {
    await this.spotifyPlayerService.playPause();
  };

  public next = async (): Promise<void> => {
    await this.spotifyPlayerService.next();
  };

  public previous = async (): Promise<void> => {
    await this.spotifyPlayerService.previous();
  };

  public seek = async (position: number): Promise<void> => {
    await this.spotifyPlayerService.seek(position);
  };

  public play = async (uris?: string[]): Promise<void> => {
    await this.spotifyPlayerService.play(uris);
  };

  public pause = async (): Promise<void> => {
    await this.spotifyPlayerService.pause();
  };

  public setVolume = async (volume: number): Promise<void> => {
    await this.spotifyPlayerService.setVolume(volume);
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

export default PluginApi;
