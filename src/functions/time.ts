export const formatTime = (ms) => {
  let s = ms / 1000, d = Math.floor(s / 86400);
  s %= 86400;
  let h = Math.floor(s / 3600);
  s %= 3600;
  let m = Math.floor(s / 60);
  s %= 60;
  return `${d ? `${d}d, ` : ''}${h ? `${h}h, ` : ''}${m ? `${m}m, ` : ''}${s.toFixed()}s`;
};

export const timeToMS = (t) => {
  const e = t.replace(/[\d\s]/g, () => "").toLowerCase().split(""),
    f = ["d", "h", "m", "s"];
  if (e.length !== new Set(e).size || !e.every((t, r, a) => f.includes(t) && f.indexOf(a[r - 1]) < f.indexOf(t))) return null;
  const d = t.replace(/([a-zA-Z])/g, "$1 ").toLowerCase().trim().split(" ").filter(t => !!t);
  if (d.some(t => !/[\d]/.test(t))) return null;
  const u = { h: 24, m: 60, s: 60 };
  for (const t of d) {
    const e = t.replace(/\D/g, ""), r = t.replace(/\d/gi, "");
    if (e >= u[r]) return null;
  }
  const o = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return d.reduce((t, e) => t + parseInt(e.substring(0, e.length - 1), 10) * o[e[e.length - 1]], 0);
};

export function convertMs(ms) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
  return { days: d, hours: h % 24, minutes: m % 60, seconds: s % 60 };
}
