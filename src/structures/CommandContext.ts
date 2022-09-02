import { ChatInputCommandInteraction, Guild, GuildMember, InteractionReplyOptions, Message, ReplyMessageOptions, TextChannel, User } from 'discord.js';
import { Player } from 'vulkava';
import { Siesta } from './Client';

export default class CommandContext {
  public client: Siesta;
  public readonly args: string[];
  public interaction: Message | ChatInputCommandInteraction;

  constructor(client: Siesta, interaction: Message | ChatInputCommandInteraction, args: string[] = []) {
    this.client = client;
    this.interaction = interaction;
    this.args = args;
  }

  public reply(opts: ReplyMessageOptions | InteractionReplyOptions): Promise<unknown> {
    if (this.interaction instanceof ChatInputCommandInteraction) {
      if (this.interaction.replied) {
        return this.interaction.followUp(Object.assign(opts, { fetchReply: true }) as InteractionReplyOptions);
      }
      if (this.interaction.deferred) {
        return this.interaction.editReply(Object.assign(opts, { fetchReply: true }) as InteractionReplyOptions);
      }
      return this.interaction.reply(Object.assign(opts, { fetchReply: true }) as InteractionReplyOptions);
    }
    if (this.interaction instanceof Message) {
      return this.interaction.reply(opts as ReplyMessageOptions);
    }
  }

  public get subCommand(): string | boolean {
    if (this.interaction instanceof ChatInputCommandInteraction) {
      return this.interaction.options.getSubcommand();
    }
    return false;
  }

  public get user(): User {
    if (this.interaction instanceof Message) {
      return this.interaction.author;
    }
    return this.interaction.user;
  }

  public get guild(): Guild {
    return this.interaction.guild;
  }

  public get guildId(): string {
    return this.interaction.guild.id;
  }

  public get member(): GuildMember {
    return this.interaction.member as GuildMember;
  }

  public get channel(): TextChannel {
    return this.interaction.channel as TextChannel;
  }

  public get player(): Player {
    return this.client.manager.players.get(this.guildId);
  }
}
