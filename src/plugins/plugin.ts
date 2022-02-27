import { PackageJSON } from './manager';
import PluginApi from './api';
import path from 'path';

export type PluginInitializer = (
  api: PluginApi,
  config?: Record<string, unknown>
) => void | Promise<void>;

export default class Plugin {
  private pluginInitializer: PluginInitializer;

  public constructor(
    private readonly pluginPath: string,
    private readonly packagesJson: PackageJSON
  ) {}

  public getIdentifier = (): string => {
    return this.packagesJson.name;
  };

  public getPluginPath = (): string => this.pluginPath;

  public getVersion = (): string => this.packagesJson.version;

  public load = async (): Promise<void> => {
    const mainPath = path.join(
      this.pluginPath,
      this.packagesJson.main || './index.js'
    );

    const module = await import(mainPath);

    if (typeof module === 'function') {
      this.pluginInitializer = module;
    } else if (
      module &&
      'default' in module &&
      typeof module.default === 'function'
    ) {
      this.pluginInitializer = module.default;
    } else {
      throw new Error(
        `Plugin ${this.pluginPath} does not export a initializer function from main.`
      );
    }
  };

  public initialize(
    api: PluginApi,
    config?: Record<string, unknown>
  ): void | Promise<void> {
    if (!this.pluginInitializer) {
      throw new Error(
        "Tried to initialize a plugin which hasn't been loaded yet!"
      );
    }

    return this.pluginInitializer(api, config);
  }
}
