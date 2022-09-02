import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { client } from '..';
import { Event } from '../structures/Event';

export default new Event('guildMemberAdd', async member => {
  const { guild } = member;
  const guildDoc = await client.db.guilds.findUnique({
    where: {
      id: guild.id
    }
  });

  if (guildDoc && guildDoc.welcome?.status && guildDoc.welcome?.channel && guildDoc.welcome?.message) {
    const message = guildDoc.welcome.message
      .replaceAll('/member/', member.toString())
      .replaceAll('/serverName/', guild.name)
      .replace('/memberId/', member.id)
      .replaceAll('/memberName/', member.user.username)
      .slice(0, 1000);

    (client.channels.cache.get(guildDoc.welcome.channel) as TextChannel).send({
      content: message,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(String(Date.now() + Math.random()))
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji({ name: '🔒' })
            .setLabel(`Message Configured by ${guild.name} Team.`)
        )
      ]
    });
  }
});
