import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'invite',
  description: '🛰️ › Replies with the bot invite',
  dmPermission: true,
  exec({ context }) {
    const button = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Invite me!').setURL('https://siestaa.vercel.app/invite');
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);

    return context.reply({
      content: '**🚀 You can invite me using the button bellow**',
      components: [row]
    });
  }
});
