import { ArtistTopTracksResponse, SearchResponse } from './api.types';

import axios from 'axios';

type SearchOptions = {
  limit: number;
  type: ('album' | 'artist' | 'track')[];
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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
  getAlbumTracks: async (id: string): Promise<ArtistTopTracksResponse> => {
    const { data } = await axios.get<ArtistTopTracksResponse>(
      `${API_URL}/api/album/${id}/tracks`
    );

    return data;
  },
  getArtistTopTracks: async (id: string): Promise<ArtistTopTracksResponse> => {
    const { data } = await axios.get<ArtistTopTracksResponse>(
      `${API_URL}/api/artist/${id}/tracks`
    );

    return data;
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
};

export default ApiClient;
