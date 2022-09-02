import chalk from 'chalk';
import { GuildMember } from 'discord.js';
import { client } from '..';
import CommandContext from '../structures/CommandContext';
import { Event } from '../structures/Event';

export default new Event('messageCreate', async message => {
  if (!message.guild || message.author.bot) return;

  let prefix: string;

  const mentionRegex = message.content.match(new RegExp(`^<@!?(${client.user.id})>`, 'gi'));
  const guildDb = await client.db.guilds.findFirst({
    where: {
      id: message.guild.id
    }
  });

  if (!guildDb) {
    await client.db.guilds.create({
      data: {
        id: message.guildId,
        welcome: {
          status: false,
          message: '',
          channel: ''
        }
      }
    });
  }

  if (message.content.match(new RegExp(`^<@!?(${client.user.id})>`, 'gi'))) {
    prefix = String(mentionRegex);
  } else if (message.content.toLowerCase().startsWith('siesta')) {
    prefix = 'siesta';
  } else {
    prefix = guildDb?.prefix ?? '<';
  }

  if (message.content === `<@${client.user.id}>` || message.content === `<@${client.user.id}>`) {
    message.reply({
      content: `**🐬 Hello,** my name is **Siesta** and my prefix in this server is **${guildDb?.prefix ?? '<'}** but you also can use my **[/] Slash Commands**!`
    });
  }

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
  if (cmd.length === 0) return;
  const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));

  if (!command) return;

  if (!command.prefixCompatible) {
    return message.reply({
      content: '**☝️ This command is only avaliable via `[/] Slash Commands` type `/` to see more.**'
    });
  }
  if (command.playerOnly && !client.manager.players.get(message.guildId)) {
    return message.reply({
      content: "**☝️ I'm not playing music on this server.**"
    });
  }
  if (command.ownerOnly && !['499356551535001610', '431768491759239211'].some(id => message.author.id === id)) return;

  if (command.sameChannelOnly) {
    const member = message.member as GuildMember;
    const currentChannel = member?.voice?.channelId;
    if (!currentChannel) {
      return message.reply({
        content: '**☝️ You need to be in a voice channel to use this command**'
      });
    }
    if (message.guild.members.me?.voice?.channel) {
      if (currentChannel !== message.guild.members.me?.voice?.channelId)
        return message.reply({
          content: '**☝️ You need to be in the same voice channel as me.**'
        });
    }
  }

  const context = new CommandContext(client, message, args);

  client.logger.info(`Command ${chalk.bold(command.name)} used in ${chalk.bold(context.guild.name)} by ${chalk.bold(context.user.username)}`, {
    tags: ['Command']
  });

  try {
    await command.exec({
      context,
      client
    });
  } catch (err) {
    if (err instanceof Error) {
      await context
        .reply({
          content: '**☝️ There was a error while executing this command, i already reported it for my developers please be patient while is gets solved!**'
        })
        .catch(() => {});
      client.logger.warn(`Error in command ${command.name}\n${err.stack}`, { tags: ['Command'] });
    }
  }
});
