import { Awaitable, ChatInputApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';
import { Siesta } from './Client';

interface ExecuteOptions {
  interaction: ChatInputCommandInteraction;
  client: Siesta;
}

export type CommandType = {
  exec: (opts: ExecuteOptions) => Awaitable<any>;
  playerOnly?: boolean;
  ownerOnly?: boolean;
  sameChannelOnly?: boolean;
} & ChatInputApplicationCommandData;

export class Command {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions);
  }
}
