import Player, { PlayerState } from '../player/player';
import PlaylistService, { FullPlaylist } from '../services/playlist';

import Logger from '../logger/logger';
import Playlist from '../db/playlist';

type PlayerUpdateListener = (player: PlayerState) => void;

export default class PluginApi {
  public constructor(
    private readonly player: Player,
    private readonly playlistService: PlaylistService
  ) {}

  /**
   * Create a logger for the plugin.
   *
   * @param {string} name of the logger - it is recommended to use the name of the plugin
   * @returns {Logger} Logger instance
   */
  public getLogger = (name: string): Logger => {
    return Logger.create(`Plugin:${name}`);
  };

  /**
   * Get the current state of the player.
   *
   * @returns {Promise<PlayerState|undefined>} state of the player - can be undefined for no playback
   */
  public getPlayer = async (): Promise<PlayerState | undefined> => {
    return await this.player.getPlayer();
  };

  /**
   * Toggle play pause.
   */
  public playPause = async (): Promise<void> => {
    await this.player.playPause();
  };

  /**
   * Skip to next song.
   */
  public next = async (): Promise<void> => {
    await this.player.next();
  };

  /**
   * Skip to previous song.
   */
  public previous = async (): Promise<void> => {
    await this.player.previous();
  };

  /**
   * Seek to position.
   *
   * @param {number} position in milliseconds
   */
  public seek = async (position: number): Promise<void> => {
    await this.player.seek(position);
  };

  /**
   * Start playback.
   *
   * @param {string[]} uris in spotify format (e.g. spotify:track:2ZTIw0fZhFp3nnvF41nvVc)
   */
  public play = async (uris?: string[]): Promise<void> => {
    await this.player.play(uris);
  };

  /**
   * Pause playback.
   */
  public pause = async (): Promise<void> => {
    await this.player.pause();
  };

  /**
   * Set the volume of the player.
   *
   * @param {number} volume in range: 0 to 100
   */
  public setVolume = async (volume: number): Promise<void> => {
    await this.player.setVolume(volume);
  };

  /**
   * Listen to player updates.
   *
   * @param {PlayerUpdateListener} listener in range: 0 to 100
   */
  public onPlayerUpdate = (listener: PlayerUpdateListener): void => {
    this.player.onPlayerUpdate(listener);
  };

  /**
   * Sort in a track specified by the spotify track id into playlist by genres.
   * If the track is already known - nothing happens.
   *
   * @param {string} spotifyTrackId
   */
  public sortInTrackToPlaylist = async (
    spotifyTrackId: string
  ): Promise<void> => {
    await this.playlistService.sortInTrack(spotifyTrackId);
  };

  /**
   * Sort in an entire album specified by the spotify album id into playlist by genres.
   * If the album is already known - nothing happens.
   *
   * @param {string} spotifyAlbumId
   */
  public sortInAlbumToPlaylist = async (
    spotifyAlbumId: string
  ): Promise<void> => {
    await this.playlistService.sortInAlbum(spotifyAlbumId);
  };

  /**
   * Get all playlists.
   *
   * @returns {Playlist[]} List of playlists
   */
  public getPlaylists = async (): Promise<Playlist[]> => {
    return await this.playlistService.getPlaylists();
  };

  /**
   * Get playlist by id including the tracks.
   *
   * @param {number} id of the playlist
   * @returns {FullPlaylist} List of playlists
   */
  public getPlaylist = async (id: number): Promise<FullPlaylist> => {
    return await this.playlistService.getPlaylist(id);
  };

  /**
   * Play a playlist by id.
   *
   * @param {number} id of the playlist
   */
  public playPlaylist = async (id: number): Promise<void> => {
    await this.playlistService.playPlaylist(id);
  };
}
