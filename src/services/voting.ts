import Player from '../player/player';
import PlaylistService from './playlist';

export class NoPlaylistPlayingError extends Error {}
export class AlreadyVotedError extends Error {}

export default class VotingService {
  public constructor(
    private readonly player: Player,
    private readonly playlistService: PlaylistService
  ) {}

  private history: Map<string, string> = new Map();

  public like = async (macAddress: string) => {
    const playlistId = this.player.getPlaylistId();

    if (!playlistId) {
      throw new NoPlaylistPlayingError();
    }

    const player = await this.player.getPlayer();

    const history = this.history.get(macAddress);

    if (history === player.item.id) {
      throw new AlreadyVotedError();
    }

    await this.playlistService.likeTrack(player.item.id, playlistId);

    this.history.set(macAddress, player.item.id);
  };

  public dislike = async (macAddress: string) => {
    const playlistId = this.player.getPlaylistId();

    if (!playlistId) {
      throw new NoPlaylistPlayingError();
    }

    const player = await this.player.getPlayer();

    const history = this.history.get(macAddress);

    if (history === player.item.id) {
      throw new AlreadyVotedError();
    }

    await this.playlistService.dislikeTrack(player.item.id, playlistId);

    this.history.set(macAddress, player.item.id);
  };
}
