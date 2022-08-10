/* eslint-disable consistent-return */
import { client } from '..';
import { Event } from '../structures/Event';
import { AutocompleteInteraction, ChatInputCommandInteraction, GuildMember, Interaction, SelectMenuInteraction } from 'discord.js';
import { request } from 'undici';

export default new Event('interactionCreate', async (interaction: Interaction) => {

  if (interaction instanceof ChatInputCommandInteraction) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    if (command.playerOnly && !client.manager.players.get(interaction.guildId)) return;

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

    try {
      await command.exec({
        interaction,
        client
      });
    } catch (err) {
      if (err instanceof Error) {
        await interaction
          .reply({
            content: '**☝️ There was a error while executing this command, i already reported it for my developers please be patient while is gets solved!**',
            ephemeral: true
          })
          .catch(() => {});
        client.logger.error(`Error in command ${command.name}\n${err.message}`, { tags: ['Command'] });
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
