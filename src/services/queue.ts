import { randomUUID } from 'crypto';

type QueueItem = {
  id: string;
  uri: string;
};

export default class QueueService {
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
    this.queue.shift();

    return this.queue[0];
  };

  public remove = (id: string): void => {
    this.queue = this.queue.filter((item) => item.id !== id);
  };

  public clear = (): void => {
    this.queue = [];
  };

  public getQueue = (): Array<QueueItem> => this.queue;
}
