import SpotifyPlayerService, { SpotifyApiError } from './player';

import { Artist } from '../clients/spotify/types/artist';
import DateUtils from '../utils/time';
import { Track as FullTrack } from '../models/track';
import Playlist from '../entities/playlist';
import SpotifyClient from '../clients/spotify/spotify';
import Track from '../entities/track';
import { mapSpotifyTrackToTrack } from './../models/track';

type FullPlaylist = {
  id: number;
  name: string;
  updatedAt: number;
  createdAt: number;
  tracks: FullTrack[];
};

export default class PlaylistService {
  private spotifyClient: SpotifyClient;
  private spotifyPlayerService: SpotifyPlayerService;

  public constructor(
    spotifyClient: SpotifyClient,
    spotifyPlayerService: SpotifyPlayerService
  ) {
    this.spotifyClient = spotifyClient;
    this.spotifyPlayerService = spotifyPlayerService;
  }

  public sortInTrack = async (spotifyTrackId: string): Promise<void> => {
    let track = await Track.findOne({ id: spotifyTrackId });

    if (!track) {
      track = new Track();
      track.id = spotifyTrackId;
      await track.save();
    }

    let spotifyArtist: Artist;

    try {
      const spotifyTrack = await this.spotifyClient.getTrack(spotifyTrackId);

      spotifyArtist = await this.spotifyClient.getArtist(
        spotifyTrack.artists[0].id
      );
    } catch (error) {
      throw new SpotifyApiError();
    }

    for (const genre of spotifyArtist.genres) {
      let playlist = await Playlist.findOne(
        { name: genre },
        {
          relations: ['tracks'],
        }
      );

      if (!playlist) {
        playlist = new Playlist();
        playlist.name = genre;
        playlist.tracks = [track];
        playlist.createdAt = DateUtils.now();
      } else {
        playlist.tracks.push(track);
      }
      playlist.updatedAt = DateUtils.now();

      await playlist.save();
    }
  };

  public sortInAlbum = async (spotifyAlbumId: string): Promise<void> => {
    const spotifyAlbum = await this.spotifyClient.getAlbumTracks(
      spotifyAlbumId,
      {
        limit: 50,
      }
    );

    for (const track of spotifyAlbum.items) {
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
        relations: ['tracks'],
      }
    );

    const response = await this.spotifyClient.getTracks(
      playlist.tracks.map((track) => track.id)
    );

    return {
      createdAt: playlist.createdAt,
      id: playlist.id,
      name: playlist.name,
      tracks: response.tracks.map(mapSpotifyTrackToTrack),
      updatedAt: playlist.updatedAt,
    };
  };

  public playPlaylist = async (id: number): Promise<void> => {
    const playlist = await Playlist.findOne(
      { id },
      {
        relations: ['tracks'],
      }
    );
    const tracks = playlist.tracks
      .sort(() => Math.random() - 0.5)
      .map((track) => `spotify:track:${track.id}`);

    await this.spotifyPlayerService.play(tracks);
  };
}
