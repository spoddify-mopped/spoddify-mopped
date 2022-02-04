export type MarketOptions = {
  market?: string;
};

export type PaginationOptions = {
  limit?: number;
  offset?: number;
};

export type CombinedOptions = MarketOptions & PaginationOptions;

export type DeviceOptions = {
  // eslint-disable-next-line camelcase
  device_id?: string;
};

export type PlayOptions = DeviceOptions & {
  // eslint-disable-next-line camelcase
  context_uri?: string;
  uris?: ReadonlyArray<string>;
  offset?: { position: number } | { uri: string };
  // eslint-disable-next-line camelcase
  position_ms?: number;
};
