import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'resume',
  description: '🎶 › Resumes the player.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  aliases: ['unpause'],
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    if (!player.current) {
      return context.reply({
        content: "☝️ There ins't any song playing right now."
      });
    }

    player.pause(false);
    context.reply({
      content: '**🎤 The player was resumed sucessfully.**'
    });
  }
});
