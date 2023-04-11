/* eslint-disable no-useless-constructor */
import { DefaultQueue, Track } from 'vulkava';
import { shorten } from '../functions/text';
import { convertMs } from '../functions/time';

export class Queue extends DefaultQueue {
  constructor() {
    super();
  }

  public getTrack(index: number) {
    return this.tracks[index];
  }

  public removeTrack(index: number) {
    return this.tracks.splice(index, 1);
  }

  public getTracksData(start: number, end: number) {
    const data = [];
    let pos = start;
    for (; pos < end && this.tracks[pos]; pos++) {
      const track = this.tracks[pos] as Track;
      data.push(`**${pos + 1} - [${shorten(track.title, 45)}](${track.uri}) \`[${this.formatTime(convertMs(track.duration))}]\`**`);
    }
    return data.join('\n');
  }

  private formatTime(time: object, format = 'dd:hh:mm:ss') {
    const formats = { dd: 'days', hh: 'hours', mm: 'minutes', ss: 'seconds' };
    const newFormat = format.replace(/dd|hh|mm|ss/g, match => time[formats[match]].toString().padStart(2, '0')).replace(/^(00:)+/g, '');
    return newFormat.length > 2 ? newFormat : `00:${newFormat}`;
  }
}
