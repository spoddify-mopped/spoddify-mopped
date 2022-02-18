import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import Logger from '../logger/logger';
import SpotifyClient from '../clients/spotify/spotify';

type DeviceType =
  | 'computer'
  | 'tablet'
  | 'smartphone'
  | 'speaker'
  | 'tv'
  | 'avr'
  | 'stb'
  | 'audiodongle';

type Bitrate = '96' | '160' | '320';

type SpotifydConfig = {
  bitrate?: Bitrate;
  backend?: string;
  deviceName?: string;
  deviceType?: DeviceType;
};

type SpotifydStatus = {
  isRunning: boolean;
};

const LOGGER = Logger.create(__filename);

export class SpotifydService {
  private spotifyClient: SpotifyClient;

  private config?: SpotifydConfig;

  private command?: string;

  private enabled: boolean;

  private running = false;

  private spotifydProcess?: ChildProcessWithoutNullStreams;

  public constructor(
    spotifyClient: SpotifyClient,
    enabled: boolean,
    config: SpotifydConfig,
    command?: string
  ) {
    this.spotifyClient = spotifyClient;
    this.enabled = enabled;
    this.config = config;
    this.command = command;
  }

  private parseConfig = () => {
    return Object.keys(this.config).flatMap((key) => {
      switch (key) {
        case 'bitrate':
          return ['--bitrate', this.config[key]];
        case 'backend':
          return ['--backend', this.config[key]];
        case 'deviceName':
          return ['--device-name', this.config[key]];
        case 'deviceType':
          return ['--device-type', this.config[key]];
      }
    });
  };

  private prettifyLog = (input: unknown): string[] => {
    return `${input}`.split('\n').filter((row) => row !== '');
  };

  private isRunning = (): boolean =>
    !!this.spotifydProcess && !this.spotifydProcess.killed && this.running;

  private addEventListeners = () => {
    this.spotifydProcess.on('spawn', () => {
      this.running = true;
      LOGGER.info(`Spotifyd started on PID: ${this.spotifydProcess.pid} `);
    });

    this.spotifydProcess.stdout.on('data', (data) => {
      const rows = this.prettifyLog(data);
      rows.map((row) => LOGGER.info(row));
    });

    this.spotifydProcess.stderr.on('data', (data) => {
      const rows = this.prettifyLog(data);
      rows.map((row) => LOGGER.error(row));
    });

    this.spotifydProcess.on('close', (code) => {
      this.running = false;
      LOGGER.info(`Spotifyd exited with code ${code}`);
    });
  };

  public start = async (): Promise<void> => {
    if (!this.enabled) {
      LOGGER.warn('Spotfiyd will not start becausee it is disabled.');
      return;
    }

    if (this.isRunning()) {
      this.spotifydProcess.removeAllListeners();
    }

    const token = await this.spotifyClient.getAccessToken();
    const user = await this.spotifyClient.getCurrentUser();

    const onEvent = 'curl -X POST http://localhost:8080/api/event';

    const config = [
      '--no-daemon',
      '--onevent',
      onEvent,
      ...this.parseConfig(),
      '--username',
      user.email,
      '--oauth-token',
      token,
    ];

    const command = this.command || 'spotifyd';

    this.spotifydProcess = spawn(command, config);

    this.addEventListeners();
  };

  public stop = (): void => {
    if (this.isRunning()) {
      process.kill(this.spotifydProcess.pid, 'SIGINT');
    }
  };

  public getStatus = (): SpotifydStatus => {
    return {
      isRunning: this.isRunning(),
    };
  };
}
