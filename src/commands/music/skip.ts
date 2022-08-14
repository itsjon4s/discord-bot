import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'skip',
  description: '🎶 › Skips the current track.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  aliases: ['s', 'pular'],
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    if (!player.current) {
      return context.reply({
        content: '**☝️ There is nothing playing.**',
        ephemeral: true
      });
    }

    player.skip();

    return context.reply({
      content: '**🎤 Music skiped sucefully.**'
    });
  }
});
