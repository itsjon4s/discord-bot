import { Awaitable, ChatInputApplicationCommandData } from 'discord.js';
import { Siesta } from './Client';
import CommandContext from './CommandContext';

interface ExecuteOptions {
  context: CommandContext;
  client: Siesta;
}

export type CommandType = {
  exec: (opts: ExecuteOptions) => Awaitable<any>;
  playerOnly?: boolean;
  ownerOnly?: boolean;
  sameChannelOnly?: boolean;
  aliases?: string[];
  prefixCompatible?: boolean;
} & ChatInputApplicationCommandData;

export class Command {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions);
  }
}
