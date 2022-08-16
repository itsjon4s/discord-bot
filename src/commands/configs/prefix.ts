import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'prefix',
  description: '📝 › Changes the bot prefix on your server.',
  dmPermission: false,
  options: [
    {
      name: 'prefix',
      description: 'The new prefix.',
      minLength: 1,
      maxLength: 3,
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  async exec({ context, client }) {
    if (!context.member.permissions.has('ManageGuild')) {
      return context.reply({
        content: '**☝️ You need have the `Manage Guild` permission to execute this command.**'
      });
    }

    const newPrefix: string = context.args[0];

    if (!newPrefix) {
      return context.reply({
        content: '**☝️ You need to put the new prefix after the command**'
      });
    }

    if (newPrefix.length > 3) {
      return context.reply({
        content: '**☝️ The prefix lenght must be lower than 3**'
      });
    }

    await client.db.guilds.update({
      where: {
        id: context.guildId
      },
      data: {
        prefix: newPrefix
      }
    });

    return context.reply({
      content: `**📝 The prefix was sucessfully changed to \`${newPrefix}\`.**`
    });
  }
});
