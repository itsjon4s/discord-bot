/* eslint-disable consistent-return */
import chalk from 'chalk';
import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, GuildMember, Interaction } from 'discord.js';
import { request } from 'undici';
import { client } from '..';
import CommandContext from '../structures/CommandContext';
import { Event } from '../structures/Event';

export default new Event('interactionCreate', async (interaction: Interaction) => {
  if (interaction instanceof ChatInputCommandInteraction) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const doc = await client.db.users.findFirst({
      where: {
        id: interaction.user.id
      }
    });

    if (!doc) {
      await client.db.users.create({
        data: {
          id: interaction.user.id
        }
      });
    }

    if (command.playerOnly && !client.manager.players.get(interaction.guildId)) {
      return interaction.reply({
        content: "**☝️ I'm not playing music on this server.**"
      });
    }

    if (command.ownerOnly && !['499356551535001610', '431768491759239211'].some(id => interaction.user.id === id)) return;

    if (command.sameChannelOnly) {
      const member = interaction.member as GuildMember;
      const currentChannel = member?.voice?.channelId;
      if (!currentChannel) {
        return interaction.reply({
          content: '**☝️ You need to be in a voice channel to use this command**',
          ephemeral: true
        });
      }
      if (interaction.guild.members.me?.voice?.channel) {
        if (currentChannel !== interaction.guild.members.me?.voice?.channelId)
          return interaction.reply({
            content: '**☝️ You need to be in the same voice channel as me.**',
            ephemeral: true
          });
      }
    }

    const args = [];

    for (const option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach(x => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    const context = new CommandContext(client, interaction, args);

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
            content: '**☝️ There was a error while executing this command, i already reported it for my developers please be patient while is gets solved!**',
            ephemeral: true
          })
          .catch(() => {});
        client.logger.warn(`Error in command ${command.name}\n${err.stack}`, { tags: ['Command'] });
      }
    }
  }

  if (interaction instanceof AutocompleteInteraction) {
    if (!interaction.member) return;
    const value = interaction.options.getFocused();
    if (!value) return interaction.respond([]);
    const res = await request(`https://clients1.google.com/complete/search?client=youtube&hl=pt-PT&ds=yt&q=${encodeURIComponent(value)}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
      }
    }).then(async r => Buffer.from(await r.body.arrayBuffer()).toString('latin1'));

    const choices = [];

    const data = res.split('[');

    for (let i = 3, min = Math.min(8 * 2, data.length); i < min; i += 2) {
      const choice = data[i].split('"')[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, cc) => String.fromCharCode(parseInt(cc, 16)));

      if (choice) {
        choices.push({
          name: choice,
          value: choice
        });
      }
    }

    interaction.respond(choices);
  }
});
