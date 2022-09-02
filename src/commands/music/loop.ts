import { Command } from '../../structures/Command';

export default new Command({
  name: 'loop',
  description: '🎶 › Sets the loop for the queue/track',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  prefixCompatible: true,
  exec({ context }) {
    if (!context.player.current) {
      context.reply({
        content: "**☝️ There isn't anything playing right now.**"
      });
    }

    if (context.player.queue.size > 0) {
      context.player.setQueueLoop(!context.player.queueRepeat);
      context.player.setTrackLoop(false);
      context.reply({
        content: `**🎤 ${context.player.queueRepeat ? 'Enabled' : 'Disabled'} queue loop.**`
      });
    } else {
      context.player.setQueueLoop(false);
      context.player.setTrackLoop(!context.player.trackRepeat);
      context.reply({
        content: `**🎤 ${context.player.trackRepeat ? 'Enabled' : 'Disabled'} track loop.**`
      });
    }
  }
});
