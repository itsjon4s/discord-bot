import { Command } from '../../structures/Command';

export default new Command({
  name: 'pause',
  description: '🎶 › Pauses the player.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  exec({ context }) {
    if (!context.player.current) {
      return context.reply({
        content: "☝️ There ins't any song playing right now."
      });
    }

    context.player.pause(true);
    return context.reply({
      content: '**🎤 The player was paused sucessfully.**'
    });
  }
});
