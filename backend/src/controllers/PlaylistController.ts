import { spotifyApi } from "../index";
import express from "express";
import Track from "../entities/Track";
import Playlist from "../entities/Playlist";

export default class PlaylistController {
  public path = "/playlist";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.addTrack);
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
          relations: ["tracks"],
        }
      );

      console.log("Playlist", genre, playlist);

      if (!playlist) {
        playlist = new Playlist();
        playlist.name = genre;
        playlist.tracks = [track];

        console.log("New playlist", genre, playlist);
      } else {
        playlist.tracks.push(track);
      }

      await playlist.save();
    }

    response.sendStatus(204);
  };
}
