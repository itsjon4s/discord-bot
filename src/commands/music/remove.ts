import { ApplicationCommandOptionType } from 'discord.js';
import { Player } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'remove',
  description: '🎶 › Remove a specific track from the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  options: [
    {
      name: 'song',
      description: 'the number of the song in the queue.',
      type: ApplicationCommandOptionType.Number,
      required: true
    }
  ],
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;
    const queue = player.queue as Queue;

    if (queue.size === 0) {
      context.reply({
        content: '☝️ The queue is empty'
      });
    }
    
    // i finish this later
  }
});
