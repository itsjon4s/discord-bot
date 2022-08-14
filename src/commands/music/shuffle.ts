import { Player } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'shuffle',
  description: '🎶 › Shuffles the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    if (player.queue.size === 0) {
      return context.reply({
        content: "**☝️ The queue is empty so there's no tracks to be skiped**",
        ephemeral: true
      });
    }

    (player.queue as Queue).shuffle();
    return context.reply({
      content: '**🕯️ The queue was shuffled sucessfully**'
    });
  }
});
