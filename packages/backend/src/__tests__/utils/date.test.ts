import DateUtils from '../../utils/date';

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(1644419279437);
});

describe('now', () => {
  it('returns a unix timestamp in seconds', () => {
    const unixTimestamp = DateUtils.now();
    expect(unixTimestamp).toBe(1644419279);
  });
});
