/* eslint-disable consistent-return */
/* eslint-disable no-eval */
/* eslint-disable no-return-await */
import { ApplicationCommandOptionType } from 'discord.js';
import { inspect } from 'util';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'eval',
  description: '☝️ › Evaluates a code (developers only)',
  prefixCompatible: true,
  ownerOnly: true,
  aliases: ['ev'],
  options: [
    {
      name: 'code',
      description: 'the code to be evaluated',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  dmPermission: true,
  async exec({ context }) {
    try {
      const expr = context.args.join(' ');
      const res = await eval(expr);
      const cleanResult = typeof res !== 'string' ? inspect(res, { depth: 0 }).replaceAll(context.client.token, '*') : res.replaceAll(context.client.token, '*');
      return context.reply({
        content: `\`\`\`js\n${cleanResult.slice(0, 1900)}\`\`\``,
        ephemeral: true
      });
    } catch (err) {
      if (err instanceof Error) {
        return context.reply({
          content: `\`\`\`js\n${err.stack}\`\`\``,
          ephemeral: true
        });
      }
    }
  }
});
