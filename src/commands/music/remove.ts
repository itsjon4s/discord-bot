import { ApplicationCommandOptionType } from 'discord.js';
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
  exec({ context }) {
    const queue = context.player.queue as Queue;

    if (!context.args[0] || isNaN(Number(context.args[0])) || Number(context.args[0]) > queue.size || Number(context.args[0]) < 0) {
      return context.reply({
        content: '**☝️ You must send a valid song number to remove from the queue.**',
        ephemeral: true
      });
    }

    const track = queue.getTrack(Number(context.args[0]));
    queue.removeTrack(Number(context.args[0]));

    return context.reply({
      content: `**🎤 Sucessfuly removed the track \`${track.title}\` from the queue!`
    });
  }
});
