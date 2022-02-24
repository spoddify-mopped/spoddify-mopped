/* eslint-disable camelcase */
export type ExternalUrls = {
  spotify: string;
};

export type ExternalIds = {
  isrc: string;
};

export type Image = {
  height: number;
  url: string;
  width: number;
};

export type PagingObject<T> = {
  href: string;
  items: T[];
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
};

export type Restrictions = {
  reason: 'market' | 'product' | 'explicit';
};

export type ExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};
