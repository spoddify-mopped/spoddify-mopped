import Queue from './../../player/queue';

describe('add', () => {
  it('adds an item as now playing when now playing is empty and returns it with an uuid', () => {
    const queue = new Queue();
    const item = queue.add('some uri');

    const playing = queue.getPlaying();

    expect(item.uri).toBe('some uri');
    expect(item).toBe(playing);
  });

  it('adds an item to the queue when playing is not empty and returns it with an uuid', () => {
    const queue = new Queue();
    queue.add('now playing');

    const item = queue.add('some uri');
    const next = queue.getNext();

    expect(item.uri).toBe('some uri');
    expect(item).toBe(next);
  });
});

describe('next', () => {
  it('returns undefined if queue is empty', () => {
    const queue = new Queue();

    expect(queue.next()).toBeUndefined();
  });

  it('returns undefined if queue is empty and adds the now playing item to history', () => {
    const queue = new Queue();
    const playing = queue.add('now playing');

    expect(queue.next()).toBeUndefined();
    expect(playing).toBe(queue.getPrevious());
  });

  it('returns the next track, removes it from queue and adds the now playing item to history', () => {
    const queue = new Queue();
    const playing = queue.add('now playing');
    const next = queue.add('next');

    expect(queue.next()).toBe(next);
    expect(playing).toBe(queue.getPrevious());
    expect(queue.getNext()).toBeUndefined();
  });
});

describe('previous', () => {
  it('returns undefined if history is empty', () => {
    const queue = new Queue();
    expect(queue.previous()).toBeUndefined();
  });

  it('prevents to skip previous when history is empty', () => {
    const queue = new Queue();
    const playing = queue.add('now playing');

    expect(queue.previous()).toBeUndefined();
    expect(playing).toBe(queue.getPlaying());
  });

  it('returns the previous track, adds now playing to queue and removes it from history', () => {
    const queue = new Queue();
    const playing = queue.add('now playing');
    const next = queue.add('next');

    queue.next();

    expect(queue.previous()).toBe(playing);
    expect(queue.getPlaying()).toBe(playing);
    expect(queue.getNext()).toBe(next);
  });
});

describe('clear', () => {
  it('clears queue, history and playing', () => {
    const queue = new Queue();
    queue.add('now playing');
    queue.add('next');
    queue.next();
    queue.previous();

    queue.clear();

    expect(queue.getNext()).toBeUndefined();
    expect(queue.getPlaying()).toBeUndefined();
    expect(queue.getPrevious()).toBeUndefined();
  });
});

describe('remove', () => {
  it('removes and item by id', () => {
    const queue = new Queue();
    queue.add('now playing');

    const item = queue.add('item');

    queue.remove(item.id);

    expect(queue.getNext()).toBeUndefined();
  });
});

describe('getPrevious', () => {
  it('returns undefined if history is empty', () => {
    const queue = new Queue();
    expect(queue.getPrevious()).toBeUndefined();
  });

  it('returns the previous item', () => {
    const queue = new Queue();
    const item = queue.add('now playing');
    queue.add('next');
    queue.next();

    const previous = queue.getPrevious();

    expect(item).toBe(previous);
  });
});

describe('getNext', () => {
  it('returns undefined if queue is empty', () => {
    const queue = new Queue();

    expect(queue.getNext()).toBeUndefined();
  });

  it('returns the next item', () => {
    const queue = new Queue();

    queue.add('now playing');

    const item = queue.add('some uri');
    const next = queue.getNext();

    expect(item).toBe(next);
  });
});

describe('getPlaying', () => {
  it('returns undefined if playing is empty', () => {
    const queue = new Queue();
    expect(queue.getPlaying()).toBeUndefined();
  });

  it('returns the playing item', () => {
    const queue = new Queue();
    const item = queue.add('now playing');

    expect(queue.getPlaying()).toBe(item);
  });
});

describe('getQueue', () => {
  it('returns empty array', () => {
    const queue = new Queue();
    expect(queue.getQueue().length).toBe(0);
  });

  it('returns queue', () => {
    const queue = new Queue();
    queue.add('now playing');
    queue.add('item 1');
    queue.add('item 2');
    queue.add('item 3');

    expect(queue.getQueue().length).toBe(3);
  });
});
