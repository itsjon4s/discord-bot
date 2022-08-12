import { Command } from '../../structures/Command';

export default new Command({
  name: 'loop',
  description: '🎶 › Sets the loop for the queue/track',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id);

    if (!player.current) {
      context.reply({
        content: "**☝️ There isn't anything playing right now.**"
      });
    }

    if (player.queue.size > 0) {
      player.setQueueLoop(!player.queueRepeat);
      player.setTrackLoop(false);
      context.reply({
        content: `**🎤 ${player.queueRepeat ? 'Enabled' : 'Disabled'} queue loop.**`
      });
    } else {
      player.setQueueLoop(false);
      player.setTrackLoop(!player.trackRepeat);
      context.reply({
        content: `**🎤 ${player.trackRepeat ? 'Enabled' : 'Disabled'} track loop.**`
      });
    }
  }
});
