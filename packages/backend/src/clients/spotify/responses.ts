/* eslint-disable camelcase */

import { Device, Player } from './types/player';

import { Album } from './types/album';
import { Artist } from './types/artist';
import { PagingObject } from './types/common';
import { Track } from './types/track';

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
