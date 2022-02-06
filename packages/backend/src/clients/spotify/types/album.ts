/* eslint-disable camelcase */
import { ExternalUrls, Image, PagingObject, Restrictions } from './common';

import { Artist } from './artist';
import { BaseTrack } from './track';

export type BaseAlbum = {
  album_type: 'album' | 'single' | 'compilation';
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date_precision: 'year' | 'month' | 'day';
  release_date: string;
  restrictions: Restrictions;
  total_tracks: number;
  type: 'album';
  uri: string;
};

export type Album = BaseAlbum & {
  tracks: PagingObject<BaseTrack>;
};
