import { Awaitable, ChatInputApplicationCommandData, ChatInputCommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { Siesta } from './Client';

interface ExecuteOptions {
  client: Siesta;
  interaction: ChatInputCommandInteraction;
  args: CommandInteractionOptionResolver;
}

export type CommandType = {
  exec: (opts: ExecuteOptions) => Awaitable<void>;
} & ChatInputApplicationCommandData;

export class Command {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions);
  }
}
