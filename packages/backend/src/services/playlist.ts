import { FullArtist } from '../clients/spotify/responses';
import Playlist from '../entities/playlist';
import { SpotifyApiError } from './player';
import SpotifyClient from '../clients/spotify/spotify';
import Track from '../entities/track';
import { spotifyPlayerService } from '..';

export default class PlaylistService {
  private spotifyClient: SpotifyClient;

  public constructor(spotifyClient: SpotifyClient) {
    this.spotifyClient = spotifyClient;
  }

  public sortInTrack = async (spotifyTrackId: string): Promise<void> => {
    let track = await Track.findOne({ id: spotifyTrackId });

    if (!track) {
      track = new Track();
      track.id = spotifyTrackId;
      await track.save();
    }

    let spotifyArtist: FullArtist;

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
      } else {
        playlist.tracks.push(track);
      }

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

  public getPlaylist = async (id: number): Promise<Playlist> => {
    return await Playlist.findOne({ id });
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

    await spotifyPlayerService.play(tracks);
  };
}
