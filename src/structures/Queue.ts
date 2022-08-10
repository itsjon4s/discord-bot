import { User } from "discord.js";
import { DefaultQueue } from "vulkava";

export class Queue extends DefaultQueue {
  constructor() {
    super()
  }

  public getTrack(index: number) {
    return this.tracks[index];
  }

  public removeTrack(index: number) {
    return this.tracks.splice(index, 1)
  }

  public getTracksData(pos: number, end: number) {
    const data = [];

    for (; pos < end && this.tracks[pos]; pos++) {
      const req = this.tracks[pos].requester as User;
      const track = this.tracks[pos]
      data.push(`**${pos + 1} - [${this.shorten(track.title, 12)}](${track.uri}) < ${req.toString()} >**`)
    }
    return data.join('\n');
  }

  private shorten(text: string, size: number) {
    if (typeof text !== 'string') return '';
    if (text.length <= size) return text;
    return text.slice(0, size).trim() + '...';
  } 
}