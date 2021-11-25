import Playlist from '../entities/Playlist';
import Track from '../entities/Track';
import express from 'express';
import { spotifyApi } from '../index';

export default class PlaylistController {
  public path = '/playlist';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.addTrack);
    this.router.get(`${this.path}`, this.getPlaylists);
    this.router.get(`${this.path}/:id`, this.getPlaylist);
  }

  private addTrack = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const { body } = request;

    let track = await Track.findOne({ id: body.id });

    if (!track) {
      track = new Track();
      track.id = body.id;

      await track.save();
    }

    const spotifyTrackResponse = await spotifyApi.getTrack(body.id);
    const spotifyArtistResponse = await spotifyApi.getArtist(
      spotifyTrackResponse.body.artists[0].id
    );

    for (const genre of spotifyArtistResponse.body.genres) {
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

    response.sendStatus(204);
  };

  private getPlaylists = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const playlist = await Playlist.find();

    response.send(playlist);
  };

  private getPlaylist = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const { params } = request;
    const playlist = await Playlist.findOne(
      { id: Number.parseInt(params.id) },
      {
        relations: ['tracks'],
      }
    );

    response.send(playlist);
  };
}
