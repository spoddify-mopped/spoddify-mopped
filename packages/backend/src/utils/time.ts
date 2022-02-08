const DateUtils = {
  now: (): number => {
    return Math.floor(Date.now() / 1000);
  },
};

export default DateUtils;
