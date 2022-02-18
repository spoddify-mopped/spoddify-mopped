import config from 'nconf';

const initializeConfig = (): void => {
  config
    .file('config.json')
    .required(['spotify:clientId', 'spotify:clientSecret']);

  config.defaults({
    app: {
      name: 'SpoddifyMopped',
    },
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
