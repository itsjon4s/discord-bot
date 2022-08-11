import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'pause',
  description: '🎶 › Pauses the player.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    if (!player.current) {
      context.reply({
        content: "☝️ There ins't any song playing right now."
      });
    }

    player.pause(true);
    context.reply({
      content: '🎤 The player was paused sucessfully.'
    });
  }
});
