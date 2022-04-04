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

  public like = async (uuid: string) => {
    const playlistId = this.player.getPlaylistId();

    if (!playlistId) {
      throw new NoPlaylistPlayingError();
    }

    const player = await this.player.getPlayer();

    const history = this.history.get(uuid);

    if (history === player.item.id) {
      throw new AlreadyVotedError();
    }

    await this.playlistService.likeTrack(player.item.id, playlistId);

    this.history.set(uuid, player.item.id);
  };

  public dislike = async (uuid: string) => {
    const playlistId = this.player.getPlaylistId();

    if (!playlistId) {
      throw new NoPlaylistPlayingError();
    }

    const player = await this.player.getPlayer();

    const history = this.history.get(uuid);

    if (history === player.item.id) {
      throw new AlreadyVotedError();
    }

    await this.playlistService.dislikeTrack(player.item.id, playlistId);

    this.history.set(uuid, player.item.id);
  };
}
