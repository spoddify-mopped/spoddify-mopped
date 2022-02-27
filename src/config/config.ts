import { OptionValues, program } from 'commander';

import config from 'nconf';

const checkRequiredConfig = () => {
  if (!config.get('spotify:clientId')) {
    console.error('Spotify client id is required. (--spotify-client-id)');
    process.exit(1);
  }

  if (!config.get('spotify:clientSecret')) {
    console.error(
      'Spotify client secret is required. (--spotify-client-secret)'
    );
    process.exit(1);
  }
};

const configFromArgv = (args: OptionValues) => {
  if (args.name) {
    config.set('app:name', args.name);
  }

  if (args.port) {
    config.set('server:port', args.port);
  }

  if (args.dataPath) {
    config.set('server:dataPath', args.dataPath);
  }

  if (args.spotifyClientId) {
    config.set('spotify:clientId', args.spotifyClientId);
  }

  if (args.spotifyClientSecret) {
    config.set('spotify:clientSecret', args.spotifyClientSecret);
  }

  if (args.audioBackend) {
    config.set('spotifyd:backend', args.audioBackend);
  }

  if (args.disableSpotifyd) {
    config.set('spotifyd:enabled', !args.disableSpotifyd);
  }

  if (args.spotifydPath) {
    config.set('spotifyd:path', args.spotifydPath);
  }
};

const initializeConfig = (): void => {
  program
    .name('spoddify-mopped')
    .description(
      'A spotify player for office use with a voting system to select music and automatic song sorting.'
    )
    .option('-c, --config-path <path>', 'path to config file', 'config.json')
    .option('-n, --name <name>', 'app name (default: "SpoddifyMopped")')
    .option('-p, --port <port>', 'server port (default: "8080")')
    .option('-d, --data-path <path>', 'path of database file (default: "./")')
    .option('--spotify-client-id <id>', 'spotify client id')
    .option('--spotify-client-secret <secret>', 'spotify client secret')
    .option(
      '--spotify-redirect-base-uri <uri>',
      'spotify redirect base uri (default: "http://localhost:8080")'
    )
    .option('--audio-backend <backend>', 'audio backend (default: "alsa")')
    .option('--disable-spotifyd', 'disable the embedded spotifyd player')
    .option(
      '--spotifyd-path <path>',
      'path to spotifyd binary (default: "spotifyd")'
    )
    .option('-v, --verbose', 'enable verbose logging')
    .version('1.0.0')
    .parse(process.argv);

  const args = program.opts();
  config.file(args.configPath);

  configFromArgv(args);
  checkRequiredConfig();

  config.defaults({
    app: {
      name: 'SpoddifyMopped',
    },
    customPluginPaths: [],
    server: { dataPath: './', port: 8080 },
    spotify: {
      redirectBaseUri: 'http://localhost:8080',
    },
    spotifyd: {
      backend: 'alsa',
      enabled: true,
      path: 'spotifyd',
    },
  });
};

export default initializeConfig;
