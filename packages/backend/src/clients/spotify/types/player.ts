import { BaseTrack } from './track';
/* eslint-disable camelcase */
import { ExternalUrls } from './common';

export type Device = {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: 'computer' | 'smartphone' | 'speaker';
  volume_percent: number;
};

export type Context = {
  external_urls: ExternalUrls;
  href: string;
  type: 'artist' | 'playlist' | 'album' | 'show';
  uri: string;
};

export type Actions = {
  interrupting_playback?: boolean;
  pausing?: boolean;
  resuming?: boolean;
  seeking?: boolean;
  skipping_next?: boolean;
  skipping_prev?: boolean;
  toggling_repeat_context?: boolean;
  toggling_repeat_track?: boolean;
  toggling_shuffle?: boolean;
  transferring_playback?: boolean;
};

export type Item = BaseTrack;

export type Player = {
  actions: Actions;
  context?: Context;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  device: Device;
  is_playing: boolean;
  item: Item;
  progress_ms?: number;
  repeat_state: 'off' | 'track' | 'context';
  shuffle_state: 'on' | 'off';
  timestamp: number;
};
