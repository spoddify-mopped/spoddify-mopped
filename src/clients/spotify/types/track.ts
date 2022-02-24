import { Artist, BaseArtist } from './artist';
import { ExternalIds, ExternalUrls, Restrictions } from './common';

/* eslint-disable camelcase */
import { Album } from './album';

export type BaseTrack = {
  album: Album;
  artists: BaseArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
};

export type Track = BaseTrack & {
  artists: Artist[];
  external_ids: ExternalIds;
  is_playable: boolean;
  restrictions: Restrictions;
  popularity: number;
};
