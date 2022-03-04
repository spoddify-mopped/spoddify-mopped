import { v4 as uuidv4 } from 'uuid';

export type QueueItem = {
  id: string;
  uri: string;
};

export default class Queue {
  private playing?: QueueItem;

  private history: Array<QueueItem> = [];

  private queue: Array<QueueItem> = [];

  public add = (uri: string): QueueItem => {
    const item = {
      id: uuidv4(),
      uri,
    };

    if (!this.playing) {
      this.playing = item;
      return item;
    }

    this.queue.push(item);

    return item;
  };

  public next = (): QueueItem | undefined => {
    if (this.playing) {
      this.history.push(this.playing);
    }

    this.playing = this.queue.shift();
    return this.playing;
  };

  public previous = (): QueueItem | undefined => {
    if (this.history.length < 1) {
      return;
    }

    if (this.playing) {
      this.queue.unshift(this.playing);
    }

    this.playing = this.history.pop();
    return this.playing;
  };

  public remove = (id: string): void => {
    this.queue = this.queue.filter((item) => item.id !== id);
  };

  public clear = (): void => {
    this.queue = [];
    this.history = [];
    this.playing = undefined;
  };

  public getPrevious = (): QueueItem | undefined =>
    this.history[this.history.length - 1];

  public getNext = (): QueueItem | undefined => this.queue[0];

  public getPlaying = (): QueueItem | undefined => this.playing;

  public getQueue = (): Array<QueueItem> => this.queue;
}
