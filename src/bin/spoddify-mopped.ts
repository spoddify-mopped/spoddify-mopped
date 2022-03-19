#!/usr/bin/env node

import { ChildProcess, fork } from 'child_process';

import path from 'path';

process.title = 'spoddify-mopped';

enum Events {
  RESTART = 'RESTART_SPODDIFY_MOPPED',
  STOP = 'STOP_SPODDIFY_MOPPED',
}

class ProcessManager {
  private process: ChildProcess;

  public start() {
    this.stop();

    this.process = fork(path.resolve(__dirname, '../main'), process.argv, {
      env: process.env,
    });

    this.process.on('message', (message) => {
      switch (message) {
        case Events.RESTART:
          this.start();
          break;
        case Events.STOP:
          this.stop();
          break;
      }
    });
  }

  public stop() {
    if (this.process && !this.process.killed) {
      process.kill(this.process.pid, 'SIGINT');
    }
  }
}

const processManager = new ProcessManager();

processManager.start();
