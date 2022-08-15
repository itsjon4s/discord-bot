import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'shuffle',
  description: '🎶 › Shuffles the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  exec({ context }) {
    if (context.player.queue.size === 0) {
      return context.reply({
        content: "**☝️ The queue is empty so there's no tracks to be skiped**",
        ephemeral: true
      });
    }

    (context.player.queue as Queue).shuffle();
    return context.reply({
      content: '**🕯️ The queue was shuffled sucessfully**'
    });
  }
});
