import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Message } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'filters',
  description: '🎶 › Enable/Disable some filter.',
  aliases: [],
  ownerOnly: false,
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  prefixCompatible: true,
  exec({ context }) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel('NightCore').setStyle(ButtonStyle.Secondary).setCustomId('nightcore'),
      new ButtonBuilder().setLabel('BassBoost').setStyle(ButtonStyle.Secondary).setCustomId('bassboost'),
      new ButtonBuilder().setLabel('8D').setStyle(ButtonStyle.Secondary).setCustomId('eightD'),
      new ButtonBuilder().setLabel('Clear Filters').setStyle(ButtonStyle.Secondary).setCustomId('clear')
    );

    context
      .reply({
        content: '**🎤 Chose the filters that you want!**',
        components: [row],
        fetchReply: true
      })
      .then((msg: Message) => {
        const collector = msg.createMessageComponentCollector({
          time: 180000
        });

        collector.on('collect', async (int: ButtonInteraction) => {
          await int.deferUpdate();
          if (int.user.id !== context.user.id) return;
          switch (int.customId) {
            case 'nightcore':
              msg.edit({
                content: '**🎸 Enabled NightCore filter!**',
                components: []
              });
              context.player.filters.clear();
              context.player.filters.setTimescale({ pitch: 1.2, rate: 1.1 }, false).setEqualizer([0.2, 0.2], false).setTremolo({ depth: 0.3, frequency: 14 }, false).apply();
              break;
            case 'bassboost':
              msg.edit({
                content: '**🎸 Enabled BassBoost filter!**',
                components: []
              });
              context.player.filters.clear();
              context.player.filters.setEqualizer([0.29, 0.23, 0.19, 0.16, 0.08]).apply();
              break;
            case 'eightD':
              msg.edit({
                content: '**🎸 Enabled 8D filter!**',
                components: []
              });
              context.player.filters.clear();
              context.player.filters.setRotation({ rotationHz: 0.2 }).apply();
              break;
            case 'clear':
              msg.edit({
                content: '**🎤 Cleared all the active filters!**',
                components: []
              });
              context.player.filters.clear();
              break;
          }
        });
      });
  }
});
