export type AuthorizationCodeGrantResponse = {
  // eslint-disable-next-line camelcase
  access_token: string;
  // eslint-disable-next-line camelcase
  expires_in: number;
  // eslint-disable-next-line camelcase
  refresh_token: string;
  // eslint-disable-next-line camelcase
  scope: string;
  // eslint-disable-next-line camelcase
  token_type: string;
};

export type RefreshTokenResponse = {
  // eslint-disable-next-line camelcase
  access_token: string;
  // eslint-disable-next-line camelcase
  expires_in: number;
  // eslint-disable-next-line camelcase
  scope: string;
  // eslint-disable-next-line camelcase
  token_type: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type ExternalIds = {
  isrc: string;
};

export type Artist = {
  // eslint-disable-next-line camelcase
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type Image = {
  height: number;
  url: string;
  width: number;
};

export type Album = {
  // eslint-disable-next-line camelcase
  album_type: string;
  artists: Artist[];
  // eslint-disable-next-line camelcase
  available_markets: string[];
  // eslint-disable-next-line camelcase
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  // eslint-disable-next-line camelcase
  release_date: string;
  // eslint-disable-next-line camelcase
  release_date_precision: string;
  // eslint-disable-next-line camelcase
  total_tracks: number;
  type: string;
  uri: string;
};

export type Track = {
  album: Album;
  artists: Artist[];
  // eslint-disable-next-line camelcase
  available_markets: string[];
  // eslint-disable-next-line camelcase
  disc_number: number;
  // eslint-disable-next-line camelcase
  duration_ms: number;
  explicit: boolean;
  // eslint-disable-next-line camelcase
  external_ids: ExternalIds;
  // eslint-disable-next-line camelcase
  external_urls: ExternalUrls;
  href: string;
  id: string;
  // eslint-disable-next-line camelcase
  is_local: boolean;
  name: string;
  popularity: number;
  // eslint-disable-next-line camelcase
  preview_url: string;
  // eslint-disable-next-line camelcase
  track_number: number;
  type: string;
  uri: string;
};

export type Device = {
  id: string;
  // eslint-disable-next-line camelcase
  is_active: boolean;
  // eslint-disable-next-line camelcase
  is_private_session: boolean;
  // eslint-disable-next-line camelcase
  is_restricted: boolean;
  name: string;
  type: string;
  // eslint-disable-next-line camelcase
  volume_percent: number;
};

export type Context = {
  // eslint-disable-next-line camelcase
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
};

export type Player = {
  device: Device;
  // eslint-disable-next-line camelcase
  shuffle_state: boolean;
  // eslint-disable-next-line camelcase
  repeat_state: string;
  timestamp: number;
  context: Context;
  // eslint-disable-next-line camelcase
  progress_ms: number;
  item: Track;
  // eslint-disable-next-line camelcase
  currently_playing_type: string;
  // eslint-disable-next-line camelcase
  is_playing: boolean;
};

export type Followers = {
  href?: string;
  total: number;
};

export type FullArtist = Artist & {
  followers: Followers;
  genres: string[];
  images: Image[];
};

export type ItemSearchResults<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string;
  offset: number;
  previous?: string;
  total: number;
};

export type SearchResult = {
  albums: ItemSearchResults<Album>;
  artists: ItemSearchResults<FullArtist>;
  tracks: ItemSearchResults<Track>;
};

export type ArtistTopTracksResponse = {
  tracks: Track[];
};

export type AlbumTracksResponse = ItemSearchResults<Track>;

export type UserDevicesResponse = {
  devices: Device[];
};
