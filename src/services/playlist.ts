import DateUtils from '../utils/date';
import { Track as FullTrack } from '../models/track';
import Player from '../player/player';
import Playlist from '../db/playlist';
import SpotifyClient from '../clients/spotify/spotify';
import Track from '../db/track';
import { TracksToPlaylists } from '../db/tracks_to_playlists';
import { mapSpotifyTrackToTrack } from './../models/track';

export class PlaylistNotFoundError extends Error {}

type PlaylistTracks = {
  addedAt: number;
  likes: number;
  track: FullTrack;
}[];

export type FullPlaylist = {
  id: number;
  name: string;
  updatedAt: number;
  createdAt: number;
  tracks: PlaylistTracks;
};

export default class PlaylistService {
  public constructor(
    private readonly spotifyClient: SpotifyClient,
    private readonly player: Player
  ) {}

  public sortInTrack = async (spotifyTrackId: string): Promise<void> => {
    let track = await Track.findOne({ id: spotifyTrackId });

    if (track) {
      return;
    }

    track = new Track();
    track.id = spotifyTrackId;
    await track.save();

    const spotifyTrack = await this.spotifyClient.getTrack(spotifyTrackId);

    const spotifyArtist = await this.spotifyClient.getArtist(
      spotifyTrack.artists[0].id
    );

    for (const genre of spotifyArtist.genres) {
      let playlist = await Playlist.findOne(
        { name: genre },
        {
          relations: ['tracksToPlaylists'],
        }
      );

      if (!playlist) {
        playlist = new Playlist();
        playlist.name = genre;
        playlist.updatedAt = DateUtils.now();
        playlist.createdAt = DateUtils.now();

        await playlist.save();
      } else {
        playlist.updatedAt = DateUtils.now();
        await playlist.save();
      }

      const tracksToPlaylists = new TracksToPlaylists();
      tracksToPlaylists.playlist = playlist;
      tracksToPlaylists.track = track;
      tracksToPlaylists.createdAt = DateUtils.now();
      tracksToPlaylists.likes = 0;

      await tracksToPlaylists.save();
    }
  };

  public sortInAlbum = async (spotifyAlbumId: string): Promise<void> => {
    const spotifyAlbumTracks = await this.spotifyClient.getAlbumTracks(
      spotifyAlbumId,
      {
        limit: 50,
      }
    );

    for (const track of spotifyAlbumTracks.items) {
      await this.sortInTrack(track.id);
    }
  };

  public likeTrack = async (
    trackId: string,
    playlistId: number
  ): Promise<void> => {
    await TracksToPlaylists.createQueryBuilder('ttp')
      .update()
      .set({
        likes: () => 'likes + 1',
      })
      .where('playlistId = :playlistId and trackId = :trackId', {
        playlistId,
        trackId,
      })
      .execute();
  };

  public dislikeTrack = async (
    trackId: string,
    playlistId: number
  ): Promise<void> => {
    await TracksToPlaylists.createQueryBuilder('ttp')
      .update()
      .set({
        likes: () => 'likes - 1',
      })
      .where('playlistId = :playlistId and trackId = :trackId and likes > 0', {
        playlistId,
        trackId,
      })
      .execute();
  };

  public getPlaylists = async (): Promise<Playlist[]> => {
    return await Playlist.find();
  };

  public getPlaylist = async (id: number): Promise<FullPlaylist> => {
    const playlist = await Playlist.findOne(
      { id },
      {
        relations: ['tracksToPlaylists', 'tracksToPlaylists.track'],
      }
    );

    if (!playlist) {
      throw new PlaylistNotFoundError();
    }

    /*
    The spotify api is limited by fetching 50 tracks in one request.
    If a playlist has more than 50 tracks, this splits it to multiple requests.
    */
    const tracks = [];
    for (let i = 0; i <= playlist.tracksToPlaylists.length; i = i + 50) {
      const t = await this.spotifyClient.getTracks(
        playlist.tracksToPlaylists
          .slice(i, i + 50)
          .map((trackToPlaylist) => trackToPlaylist.track.id)
      );

      tracks.push(...t.tracks);
    }

    return {
      createdAt: playlist.createdAt,
      id: playlist.id,
      name: playlist.name,
      tracks: tracks.map((track, index) => ({
        addedAt: playlist.tracksToPlaylists[index].createdAt,
        likes: playlist.tracksToPlaylists[index].likes,
        track: mapSpotifyTrackToTrack(track),
      })),
      updatedAt: playlist.updatedAt,
    };
  };

  public playPlaylist = async (id: number): Promise<void> => {
    const playlist = await Playlist.findOne(
      { id },
      {
        relations: ['tracksToPlaylists', 'tracksToPlaylists.track'],
      }
    );

    if (!playlist) {
      throw new PlaylistNotFoundError();
    }

    const tracks = playlist.tracksToPlaylists
      .flatMap((trackToPlaylist) => {
        const ids: Array<string> = [];
        for (let i = 0; i <= trackToPlaylist.likes; i++) {
          ids.push(`spotify:track:${trackToPlaylist.track.id}`);
        }

        return ids;
      })
      .sort(() => Math.random() - 0.5);

    await this.player.play(tracks, id);
  };
}
