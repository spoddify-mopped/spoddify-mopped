import { Artist, Followers } from './types/artist';
import { Device, Player } from './types/player';
import {
  ExplicitContent,
  ExternalUrls,
  Image,
  PagingObject,
} from './types/common';

import { Album } from './types/album';
import { Track } from './types/track';

/* eslint-disable camelcase */

type BaseTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

export type RefreshTokenResponse = BaseTokenResponse;

export type AuthorizationCodeGrantResponse = BaseTokenResponse & {
  refresh_token: string;
};

export type SearchResponse = {
  albums?: PagingObject<Album>;
  artists?: PagingObject<Artist>;
  tracks?: PagingObject<Track>;
};

export type TracksResponse = {
  tracks: Track[];
};

export type AlbumTracksResponse = PagingObject<Track>;

export type UserDevicesResponse = {
  devices: Device[];
};

export type PlayerResponse = Player;

export type TrackResponse = Track;

export type ArtistResponse = Artist;

export type UserResponse = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
};
