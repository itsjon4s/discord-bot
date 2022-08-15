import { ChatInputCommandInteraction, Guild, GuildMember, InteractionReplyOptions, Message, ReplyMessageOptions, TextChannel, User } from 'discord.js';
import { Player } from 'vulkava';
import { Siesta } from './Client';

export default class CommandContext {
  public client: Siesta;
  public readonly args: string[];
  private interactionOrMessage: Message | ChatInputCommandInteraction;

  constructor(client: Siesta, interaction: Message | ChatInputCommandInteraction, args: string[] = []) {
    this.client = client;
    this.interactionOrMessage = interaction;
    this.args = args;
  }

  public reply(opts: ReplyMessageOptions | InteractionReplyOptions): Promise<unknown> {
    if (this.interactionOrMessage instanceof ChatInputCommandInteraction) {
      if (this.interactionOrMessage.replied) {
        return this.interactionOrMessage.followUp(Object.assign(opts, { fetchReply: true }) as InteractionReplyOptions);
      }
      if (this.interactionOrMessage.deferred) {
        return this.interactionOrMessage.editReply(Object.assign(opts, { fetchReply: true }) as InteractionReplyOptions);
      }
      return this.interactionOrMessage.reply(Object.assign(opts, { fetchReply: true }) as InteractionReplyOptions);
    }
    if (this.interactionOrMessage instanceof Message) {
      return this.interactionOrMessage.reply(opts as ReplyMessageOptions);
    }
  }

  public get user(): User {
    if (this.interactionOrMessage instanceof Message) {
      return this.interactionOrMessage.author;
    }
    return this.interactionOrMessage.user;
  }

  public get guild(): Guild {
    return this.interactionOrMessage.guild;
  }

  public get guildId(): string {
    return this.interactionOrMessage.guild.id;
  }

  public get member(): GuildMember {
    return this.interactionOrMessage.member as GuildMember;
  }

  public get channel(): TextChannel {
    return this.interactionOrMessage.channel as TextChannel;
  }

  public get player(): Player {
    return this.client.manager.players.get(this.guildId);
  }
}
