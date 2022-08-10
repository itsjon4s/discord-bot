/* eslint-disable consistent-return */
/* eslint-disable no-eval */
/* eslint-disable no-return-await */
import { ApplicationCommandOptionType } from 'discord.js';
import { inspect } from 'util';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'eval',
  description: 'evaluates a code (dev only)',
  ownerOnly: true,
  options: [
    {
      name: 'code',
      description: 'the code to be evaluated',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  async exec({ interaction, client }) {
    try {
      const res = await eval(interaction.options.getString('code'));
      const cleanResult = typeof res !== 'string' ? inspect(res, { depth: 0 }).replaceAll(client.token, '*') : res.replaceAll(client.token, '*');
      return await interaction.reply({
        content: `\`\`\`js\n${cleanResult.slice(0, 1900)}\`\`\``
      });
    } catch (err) {
      if (err instanceof Error) {
        return await interaction.reply({
          content: `\`\`\`js\n${err.stack}\`\`\``
        });
      }
    }
  }
});
