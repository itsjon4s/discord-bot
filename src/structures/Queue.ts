/* eslint-disable no-useless-constructor */
import { User } from 'discord.js';
import { DefaultQueue, Track } from 'vulkava';
import { shorten } from '../functions/text';

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
      const req = this.tracks[pos].requester as User;
      const track = this.tracks[pos] as Track;
      data.push(`**${pos + 1} - [${shorten(track.title, 12)}](${track.uri}) < ${req.toString()} >**`);
    }
    return data.join('\n');
  }
}
