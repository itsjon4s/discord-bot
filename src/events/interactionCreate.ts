import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..';
import { Event } from '../structures/Event';

export default new Event('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.exec({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction
      });
    } catch (err) {
      client.logger.error(`Error in command ${command.name}\n${err}`, { tags: ['Command'] });
    }
  }
});
