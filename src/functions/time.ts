/* eslint-disable no-bitwise */

export const formatTime = (ms: number) => {
  let seconds = ms / 1000;
  const days = ~~(seconds / 86400);
  seconds %= 86400;
  const hours = ~~(seconds / 3600);
  seconds %= 3600;
  const minutes = ~~(seconds / 60);
  seconds %= 60;

  if (days) {
    return `${days}d, ${hours}h, ${minutes}m, ${seconds.toFixed()}s`;
  }
  if (hours) {
    return `${hours}h, ${minutes}m, ${seconds.toFixed()}s`;
  }
  if (minutes) {
    return `${minutes}m, ${seconds.toFixed()}s`;
  }
  return `${seconds.toFixed()}s`;
};

export const timeToMS = (time: string) => {
  const timeUnits = time
    .replace(/[\d\s]/g, () => '')
    .toLowerCase()
    .split('');
  const formats = ['d', 'h', 'm', 's'];

  const isValid = timeUnits.length === new Set(timeUnits).size && timeUnits.every((u, i, a) => formats.includes(u) && formats.indexOf(a[i - 1]) < formats.indexOf(u));
  if (!isValid) return null;

  const formatted = time
    .replace(/([a-zA-Z])/g, '$1 ')
    .toLowerCase()
    .trim()
    .split(' ')
    .filter(f => !!f);
  if (formatted.some(e => !/[0-9]/.test(e))) return null;

  const invalid = {
    h: 24,
    m: 60,
    s: 60
  };
  for (const f of formatted) {
    const value = f.replace(/\D/g, '');
    const unit = f.replace(/\d/gi, '');

    if (value >= invalid[unit]) return null;
  }

  const convertions = {
    d: 86_400_000,
    h: 3_600_000,
    m: 60_000,
    s: 1000
  };

  return formatted.reduce((acc, curr) => acc + parseInt(curr.substring(0, curr.length - 1), 10) * convertions[curr[curr.length - 1]], 0);
};
