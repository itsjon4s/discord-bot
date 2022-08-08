import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits, Options } from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { client } from '..';
import { CommandType } from './Command';
import { Event } from './Event';
import { createLogger, Logger } from './Logger';

const globPromise = promisify(glob);

export class Siesta extends Client {
  public commands: Collection<string, CommandType>;
  public logger: Logger;

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
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates]
    });
    this.commands = new Collection();
  }

  async init() {
    this.logger = createLogger(
      {
        handleExceptions: true,
        handleRejections: true
      },
      this
    );
    this.registerModules();
    this.login(process.env.token);
  }

  async importFile(file: string) {
    return (await import(file))?.default;
  }

  registerModules() {
    this.loadCommands();
    this.loadEvents();
  }

  async loadCommands() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);

    commandFiles.forEach(async file => {
      const command: CommandType = await this.importFile(file);
      if (!command.name) return;
      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.logger.info(`Loaded ${commandFiles.length} commands successfully!`, { tags: ['Commands'] });

    this.on('ready', () => {
      if(process.env.enviroment === 'prod') client.application.commands.set(slashCommands);
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
