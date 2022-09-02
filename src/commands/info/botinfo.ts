import { EmbedBuilder } from 'discord.js';
import { formatTime } from '../../functions/time';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'botinfo',
  description: '🛰️ › Replies some bot infos.',
  dmPermission: true,
  prefixCompatible: true,
  async exec({ context, client }) {
    const embed = new EmbedBuilder()
      .setColor('#89b4fa')
      .setDescription(
        '**Hello**, my name is **Siesta** and i am a **music bot** made using ** [TypeScript](https://www.typescriptlang.org/) & [Node.js](https://nodejs.org/en/) ** with the propuse to **entratain the members of your server**.'
      )
      .addFields({
        name: '🐬 Informations',
        value: `> **Creator: \`${await client.users.fetch('431768491759239211').then(user => user.tag)}\`\n> Servers: \`${client.guilds.cache.size}\`\n> Uptime: \`${formatTime(
          client.uptime
        )}\`\n> Created At: \`${client.user.createdAt.toLocaleDateString('pt-BR')}\`**`,
        inline: true
      });

    context.reply({
      embeds: [embed]
    });
  }
});
