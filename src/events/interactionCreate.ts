/* eslint-disable consistent-return */
import { client } from '..';
import { Event } from '../structures/Event';
import { GuildMember, Interaction } from 'discord.js';
import { request } from 'undici';

export default new Event('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.playerOnly && !client.manager.players.get(interaction.guildId)) return;

    if (command.ownerOnly && interaction.user.id !== '431768491759239211') return;

    if (command.sameChannelOnly) {
      const member = interaction.member as GuildMember;
      const currentChannel = member?.voice?.channelId;
      if (!currentChannel) return interaction.reply({ content: '<:errado:977717009833934898> nao' });
    }

    try {
      await command.exec({
        interaction,
        client
      });
    } catch (err) {
      client.logger.error(`Error in command ${command.name}\n${err}`, { tags: ['Command'] });
    }
  }

  if (interaction.isAutocomplete()) {
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
