import { Awaitable, ClientEvents } from 'discord.js';

export class Event<Key extends keyof ClientEvents> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public name: Key, public exec: (...args: ClientEvents[Key]) => Awaitable<void>) {}
}
