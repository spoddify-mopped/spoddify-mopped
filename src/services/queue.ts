import { randomUUID } from 'crypto';

type QueueItem = {
  id: string;
  uri: string;
};

export default class QueueService {
  private playing?: QueueItem;

  private queue: Array<QueueItem> = [];

  public add = (uri: string): QueueItem => {
    const item = {
      id: randomUUID(),
      uri,
    };

    this.queue.push(item);

    return item;
  };

  public next = (): QueueItem | undefined => {
    this.playing = this.queue.shift();
    return this.playing;
  };

  public remove = (id: string): void => {
    this.queue = this.queue.filter((item) => item.id !== id);
  };

  public clear = (): void => {
    this.queue = [];
  };

  public getNext = (): QueueItem | undefined => this.queue[0];

  public getPlaying = (): QueueItem | undefined => this.playing;

  public getQueue = (): Array<QueueItem> => this.queue;
}
