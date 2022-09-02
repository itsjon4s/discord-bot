import { Command } from '../../structures/Command';

export default new Command({
  name: 'restart',
  description: '🎶 › Restarts the current song.',
  dmPermission: false,
  playerOnly: true,
  sameChannelOnly: true,
  prefixCompatible: true,
  exec({ context }) {
    if (!context.player.current) {
      return context.reply({
        content: "**☝️ The isn't any song playing right now.**"
      });
    }

    context.player.seek(0);
    return context.reply({
      content: '**🎤 Restarted the track sucessfully.**'
    });
  }
});
