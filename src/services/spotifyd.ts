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

export class SpotifydService {
  private readonly logger = Logger.create(SpotifydService.name);

  private running = false;
  private process?: ChildProcessWithoutNullStreams;

  public constructor(
    private readonly spotifyClient: SpotifyClient,
    private readonly enabled: boolean,
    private readonly config: SpotifydConfig,
    private readonly command?: string
  ) {}

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
    !!this.process && !this.process.killed && this.running;

  private addEventListeners = () => {
    this.process.on('spawn', () => {
      this.running = true;
      this.logger.info(`Spotifyd started on PID: ${this.process.pid} `);
    });

    this.process.on('error', () => {
      this.logger.error(
        'Spotifyd could not be started. Check the path of the spotifyd binary or disable spotifyd.'
      );
      process.exit(1);
    });

    this.process.stdout.on('data', (data) => {
      const rows = this.prettifyLog(data);
      rows
        .filter(
          (row) =>
            !row.includes("couldn't parse packet") &&
            !row.includes('error sending packet Os')
        )
        .map((row) => this.logger.debug(row));
    });

    this.process.stderr.on('data', (data) => {
      const rows = this.prettifyLog(data);
      rows.map((row) => this.logger.error(row));
    });

    this.process.on('close', (code) => {
      this.running = false;
      this.logger.info(`Spotifyd exited with code ${code}`);
    });
  };

  public start = async (): Promise<void> => {
    if (!this.enabled) {
      this.logger.warn('Spotfiyd will not start because it is disabled.');
      return;
    }

    if (this.isRunning()) {
      this.process.removeAllListeners();
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

    this.process = spawn(command, config);

    this.addEventListeners();
  };

  public stop = (): void => {
    if (this.process) {
      this.process.kill('SIGINT');
    }
  };

  public getStatus = (): SpotifydStatus => {
    return {
      isRunning: this.isRunning(),
    };
  };
}
