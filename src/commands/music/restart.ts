import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'restart',
  description: '🎶 › Restarts the current song.',
  dmPermission: false,
  playerOnly: true,
  sameChannelOnly: true,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    if (!player.current) {
      return context.reply({
        content: "**☝️ The isn't any song playing right now.**"
      });
    }

    player.seek(0);
    context.reply({
      content: '**🎤 Restarted the track sucessfully.**'
    });
  }
});
