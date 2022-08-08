import { ClientEvents } from "discord.js";

export class Event<Key extends keyof ClientEvents> {
    constructor(
        public name: Key,
        public exec: (...args: ClientEvents[Key]) => any
    ) {}
}
