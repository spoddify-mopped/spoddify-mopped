/* eslint-disable camelcase */
import { ExternalUrls, Image } from './common';

export type Followers = {
  href?: string;
  total: number;
};

export type BaseArtist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};

export type Artist = BaseArtist & {
  followers: Followers;
  genres: string[];
  images: Image[];
};
