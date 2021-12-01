import { SearchResponse } from './api.types';
import axios from 'axios';

type SearchOptions = {
  limit: number;
  type: ('album' | 'artist' | 'track')[];
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default class ApiClient {
  public static search = async (
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
  };

  public static addTrack = async (id: string): Promise<void> => {
    await axios.post(`${API_URL}/playlist`, {
      id,
    });
  };
}
