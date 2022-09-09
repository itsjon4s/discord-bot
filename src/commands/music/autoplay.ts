import { Command } from '../../structures/Command';

export default new Command({
  name: 'autoplay',
  description: '🎶 › Toogles autoplay mode.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  prefixCompatible: true,
  exec({ context }) {
    if (!context.player.current) {
      return context.reply({
        content: "☝️ There ins't any song playing right now."
      });
    }
    const { autoplay } = context.client.manager;
    const isAutoplayEnabled = !!context.client.manager.autoplay.get(context.guildId);

    if (isAutoplayEnabled) {
      autoplay.delete(context.guildId);
      return context.reply({
        content: '**🎤 Disabled the autoplay sucessfully.**'
      });
    } else {
      autoplay.set(context.guildId, context.player.current);
      return context.reply({
        content: '**🎤 Enabled the autoplay sucessfully.**'
      });
    }
  }
});
