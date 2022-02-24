import {
  AlbumWithTracks,
  Artist,
  ArtistTopTracksResponse,
  ArtistsAlbumsResponse,
  FullPlaylist,
  Playlist,
  SearchResponse,
  SpotifydStatus,
  SystemStatus,
} from './api.types';

import axios from 'axios';

type SearchOptions = {
  limit: number;
  type: ('album' | 'artist' | 'track')[];
};

const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

const ApiClient = {
  addAlbum: async (id: string): Promise<void> => {
    await axios.post(`${API_URL}/api/playlist/add/album`, {
      id,
    });
  },
  addTrack: async (id: string): Promise<void> => {
    await axios.post(`${API_URL}/api/playlist/add/track`, {
      id,
    });
  },
  getAlbum: async (id: string): Promise<AlbumWithTracks> => {
    const { data } = await axios.get<AlbumWithTracks>(
      `${API_URL}/api/album/${id}`
    );

    return data;
  },
  getAlbumTracks: async (id: string): Promise<ArtistTopTracksResponse> => {
    const { data } = await axios.get<ArtistTopTracksResponse>(
      `${API_URL}/api/album/${id}/tracks`
    );

    return data;
  },
  getArtist: async (id: string): Promise<Artist> => {
    const { data } = await axios.get<Artist>(`${API_URL}/api/artist/${id}`);

    return data;
  },
  getArtistTopTracks: async (id: string): Promise<ArtistTopTracksResponse> => {
    const { data } = await axios.get<ArtistTopTracksResponse>(
      `${API_URL}/api/artist/${id}/tracks`
    );

    return data;
  },
  getArtistsAlbums: async (
    id: string,
    limit?: number
  ): Promise<ArtistsAlbumsResponse> => {
    const { data } = await axios.get<ArtistsAlbumsResponse>(
      `${API_URL}/api/artist/${id}/albums`,
      {
        params: {
          limit,
        },
      }
    );

    return data;
  },
  getPlaylist: async (id: number): Promise<FullPlaylist> => {
    const { data } = await axios.get<FullPlaylist>(
      `${API_URL}/api/playlist/${id}`
    );

    return data;
  },
  getPlaylists: async (): Promise<Playlist[]> => {
    const { data } = await axios.get<Playlist[]>(`${API_URL}/api/playlist`);
    return data;
  },
  getSpotifydStatus: async (): Promise<SpotifydStatus> => {
    const { data } = await axios.get<SpotifydStatus>(
      `${API_URL}/api/system/spotifyd/status`
    );
    return data;
  },
  getSystemStatus: async (): Promise<SystemStatus> => {
    const { data } = await axios.get<SystemStatus>(
      `${API_URL}/api/system/status`
    );
    return data;
  },
  next: async (): Promise<void> => {
    await axios.post(`${API_URL}/api/player/forwards`);
  },
  playPause: async (): Promise<void> => {
    await axios.post(`${API_URL}/api/player/pause`);
  },
  playPlaylist: async (id: number): Promise<void> => {
    await axios.post<void>(`${API_URL}/api/playlist/${id}/play`);
  },
  previous: async (): Promise<void> => {
    await axios.post(`${API_URL}/api/player/previous`);
  },
  restartSpotifyd: async (): Promise<void> => {
    await axios.post(`${API_URL}/api/system/spotifyd/restart`);
  },
  search: async (
    query: string,
    options?: SearchOptions
  ): Promise<SearchResponse> => {
    const { data } = await axios.get<SearchResponse>(`${API_URL}/api/search`, {
      params: {
        query,
        ...options,
      },
    });

    return data;
  },
  seek: async (position: number): Promise<void> => {
    await axios.put(`${API_URL}/api/player/seek`, null, {
      params: {
        position,
      },
    });
  },
  setVolume: async (volume: number): Promise<void> => {
    await axios.put(`${API_URL}/api/player/volume`, null, {
      params: {
        volume,
      },
    });
  },
};

export default ApiClient;
