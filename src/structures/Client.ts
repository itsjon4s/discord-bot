import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits, Options } from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
// @ts-ignore
import config from '../../config';
import { CommandType } from './Command';
import { Event } from './Event';
import { createLogger, Logger } from './Logger';
import { Manager } from './Music';
import { PrismaClient } from '@prisma/client';

const globPromise = promisify(glob);

export class Siesta extends Client {
  public commands: Collection<string, CommandType>;
  public aliases: Collection<string, string>;
  public logger: Logger;
  public manager: Manager;
  public db: PrismaClient;

  constructor() {
    super({
      makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: 0,
        BaseGuildEmojiManager: 0,
        GuildMemberManager: Infinity,
        GuildStickerManager: 0,
        GuildScheduledEventManager: 0,
        MessageManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: 0
      }),
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
      presence: { status: config.enviroment === 'dev' ? 'idle' : 'online' },
      allowedMentions: {
        parse: ['users'],
        repliedUser: false
      }
    });
    this.commands = new Collection();
    this.aliases = new Collection();
    this.manager = new Manager(this, config.nodes);
    this.db = new PrismaClient();
  }

  init() {
    this.logger = createLogger(
      {
        handleExceptions: true,
        handleRejections: true
      },
      this
    );
    this.registerModules();
    this.login(config.token);
  }

  async importFile(file: string) {
    return (await import(file))?.default;
  }

  registerModules() {
    this.loadCommands();
    this.loadEvents();
    this.db.$connect();
  }

  async loadCommands() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);

    commandFiles.forEach(async file => {
      const command: CommandType = await this.importFile(file);
      if (!command.name) return;
      this.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => {
          this.aliases.set(alias, command.name);
        });
      }
      slashCommands.push(command);
    });

    this.logger.info(`Loaded ${commandFiles.length} commands successfully!`, { tags: ['Commands'] });

    this.on('ready', () => {
      if (config.enviroment === 'prod') this.application.commands.set(slashCommands);
    });
  }

  async loadEvents() {
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async file => {
      const event: Event<keyof ClientEvents> = await this.importFile(file);
      this.on(event.name, event.exec);
    });

    this.logger.info(`Loaded ${eventFiles.length} events successfully!`, { tags: ['Events'] });
  }
}
