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

    if (player.queue.size === 0)
      return context.reply({
        content: "☝️ The queue is empty so there's no tracks to be skiped",
        ephemeral: true
      });

    player.skip();

    return context.reply({
      content: '🎤 Music skiped sucefully.'
    });
  }
});
