import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'invite',
  description: '🛰️ › Replies with the bot invite',
  dmPermission: true,
  exec({ context, client }) {
    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Invite me!')
      // .setEmoji({ name: '❤️' })
      .setURL('https://discord.com/api/oauth2/authorize?client_id=907747074118926347&permissions=271641686&scope=applications.commands%20bot');
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);

    return context.reply({
      content: '**🚀 You can invite me using the button bellow**',
      components: [row]
    });
  }
});
