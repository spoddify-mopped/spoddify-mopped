import DateUtils from '../utils/date';
import { Track as FullTrack } from '../models/track';
import Playlist from '../db/playlist';
import SpotifyClient from '../clients/spotify/spotify';
import SpotifyPlayerService from './player';
import Track from '../db/track';
import { TracksToPlaylists } from '../db/tracks_to_playlists';
import { mapSpotifyTrackToTrack } from './../models/track';

export class PlaylistNotFoundError extends Error {}

type PlaylistTracks = {
  addedAt: number;
  track: FullTrack;
}[];

type FullPlaylist = {
  id: number;
  name: string;
  updatedAt: number;
  createdAt: number;
  tracks: PlaylistTracks;
};

export default class PlaylistService {
  public constructor(
    private readonly spotifyClient: SpotifyClient,
    private readonly spotifyPlayerService: SpotifyPlayerService
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
      .sort(() => Math.random() - 0.5)
      .map((trackToPlaylist) => `spotify:track:${trackToPlaylist.track.id}`);

    await this.spotifyPlayerService.play(tracks);
  };
}
