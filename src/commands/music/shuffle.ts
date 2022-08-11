import { Player } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'shuffle',
  description: 'Shuffles the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    (player.queue as Queue).shuffle();
    return context.reply({
      content: '🕯️ The queue was shuffled sucessfully'
    });
  }
});
