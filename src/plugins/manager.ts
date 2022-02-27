import { existsSync, readFileSync, readdirSync } from 'fs';

import Logger from '../logger/logger';
import Plugin from './plugin';
import PluginApi from './api';
import { execSync } from 'child_process';
import path from 'path';

export type PackageJSON = {
  name: string;
  version: string;
  main?: string;
  type?: 'module' | 'commonjs';
};

export type PluginManagerOptions = {
  customPluginPaths?: string[];
  disabledPlugins?: string[];
};

const PLUGIN_IDENTIFIER_PATTERN = /spoddify-mopped-.*$/;

export default class PluginManager {
  private readonly logger = Logger.create(PluginManager.name);

  private readonly plugins: Map<string, Plugin> = new Map();

  private readonly searchPaths: Set<string> = new Set();

  public constructor(
    private readonly api: PluginApi,
    private readonly options?: PluginManagerOptions
  ) {
    if (options) {
      if (options.customPluginPaths) {
        options.customPluginPaths.map(this.searchPaths.add);
      }
    }
  }

  public getPlugins = (): Map<string, Plugin> => this.plugins;

  public initializePlugins = async (): Promise<void> => {
    const startTime = Date.now();

    this.addInstalledPlugins();

    if (this.plugins.size < 1) {
      this.logger.info(`No plugins found.`);
      return;
    }

    this.logger.info(
      `Start loading plugins. Found ${this.plugins.size} plugin${
        this.plugins.size !== 1 ? 's' : ''
      }.`
    );

    for (const [identifier, plugin] of this.plugins) {
      this.initializePlugin(identifier, plugin);
    }

    this.logger.debug(
      `Loading plugins finished in ${Date.now() - startTime}ms`
    );
  };

  private initializePlugin = async (
    identifier: string,
    plugin: Plugin
  ): Promise<void> => {
    if (
      this.options.disabledPlugins &&
      this.options.disabledPlugins.includes(identifier)
    ) {
      this.logger.error(`Disabled plugin ${identifier}.`);
      return;
    }

    try {
      await plugin.load();
    } catch (error) {
      this.logger.error(`Loading plugin ${identifier} failed with: ${error}`);
      this.plugins.delete(identifier);
      return;
    }

    this.logger.info(`Loaded plugin: ${identifier}@${plugin.getVersion()}`);

    try {
      await plugin.initialize(this.api);
    } catch (error) {
      this.logger.error(
        `Initializing plugin ${identifier} failed with: ${error}`
      );
      this.plugins.delete(identifier);
    }
  };

  private addPlugin = (pluginPath: string) => {
    const packageJson: PackageJSON = this.loadPackageJSON(pluginPath);

    const alreadyInstalled = this.plugins.get(packageJson.name);
    if (alreadyInstalled) {
      this.logger.warn(
        `Skipping plugin ${
          packageJson.name
        } since it is already loaded from ${alreadyInstalled.getPluginPath()}.`
      );
      return;
    }

    const plugin = new Plugin(pluginPath, packageJson);
    this.plugins.set(packageJson.name, plugin);
  };

  private loadPackageJSON = (pluginPath: string): PackageJSON => {
    const packageJsonPath = path.join(pluginPath, 'package.json');
    let packageJson: PackageJSON;

    if (!existsSync(packageJsonPath)) {
      throw new Error(`Plugin ${pluginPath} does not contain a package.json.`);
    }

    try {
      packageJson = JSON.parse(
        readFileSync(packageJsonPath, { encoding: 'utf8' })
      );
    } catch (error) {
      throw new Error(
        `Loading package.json of ${pluginPath} failed with: ${error}`
      );
    }

    if (
      !packageJson.name ||
      !this.isQualifiedPluginIdentifier(packageJson.name)
    ) {
      throw new Error(
        `Plugin ${pluginPath} does not have a package name that begins with 'spoddify-mopped-' or '@scope/spoddify-mopped-'.`
      );
    }

    return packageJson;
  };

  private isQualifiedPluginIdentifier = (identifier: string): boolean => {
    return PLUGIN_IDENTIFIER_PATTERN.test(identifier);
  };

  private addScopedPlugin = (
    searchPath: string,
    scope: string,
    module: string
  ): void => {
    if (this.isQualifiedPluginIdentifier(module)) {
      this.addPlugin(path.resolve(searchPath, `${scope}/${module}`));
    }
  };

  private checkScopedPlugins = (
    searchPath: string,
    directory: string
  ): void => {
    readdirSync(path.resolve(searchPath, directory)).forEach((module) => {
      this.addScopedPlugin(searchPath, directory, module);
    });
  };

  private addInstalledPlugins = (): void => {
    this.loadDefaultSearchPaths();

    this.searchPaths.forEach((searchPath) => {
      if (!existsSync(searchPath)) {
        return;
      }

      // Check if path points to single plugin and not to a directory containing plugins
      if (existsSync(path.join(searchPath, 'package.json'))) {
        this.addPlugin(searchPath);
        return;
      }

      const directories = readdirSync(searchPath);

      directories.forEach((directory) => {
        // Check if a scope contains qualified plugins
        if (directory.startsWith('@')) {
          this.checkScopedPlugins(searchPath, directory);
          return;
        }

        // Load plugin with qualified identifier
        if (this.isQualifiedPluginIdentifier(directory)) {
          this.addPlugin(path.resolve(searchPath, directory));
        }
      });
    });
  };

  private loadDefaultSearchPaths = (): void => {
    if (process.env.NODE_PATH) {
      process.env.NODE_PATH.split(path.delimiter)
        .filter((path) => !!path)
        .forEach((path) => this.searchPaths.add(path));

      return;
    }

    const modulesPath = this.getNodePath();
    this.searchPaths.add(`${modulesPath}/lib/node_modules`);

    if (process.platform !== 'win32') {
      this.searchPaths.add('/usr/local/lib/node_modules');
      this.searchPaths.add('/usr/lib/node_modules');
    }
  };

  private getNodePath = () =>
    `${execSync('npm --no-update-notifier -g prefix')}`.trim();
}
