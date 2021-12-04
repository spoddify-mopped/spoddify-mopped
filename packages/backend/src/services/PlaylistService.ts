import Playlist from '../entities/Playlist';
import { SpotifyApiError } from './SpotifyPlayerService';
import SpotifyWebApi from 'spotify-web-api-node';
import Track from '../entities/Track';
import { spotifyPlayerService } from '..';

export default class PlaylistService {
  private spotifyApiClient: SpotifyWebApi;

  public constructor(spotifyApiClient: SpotifyWebApi) {
    this.spotifyApiClient = spotifyApiClient;
  }

  public sortInTrack = async (spotifyTrackId: string): Promise<void> => {
    let track = await Track.findOne({ id: spotifyTrackId });

    if (!track) {
      track = new Track();
      track.id = spotifyTrackId;
      await track.save();
    }

    let spotifyArtist: SpotifyApi.SingleArtistResponse;

    try {
      const spotifyTrack = (
        await this.spotifyApiClient.getTrack(spotifyTrackId)
      ).body;

      spotifyArtist = (
        await this.spotifyApiClient.getArtist(spotifyTrack.artists[0].id)
      ).body;
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
    const spotifyAlbum = (
      await this.spotifyApiClient.getAlbumTracks(spotifyAlbumId, {
        limit: 50,
      })
    ).body;

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
