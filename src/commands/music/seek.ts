import { ApplicationCommandOptionType } from 'discord.js';
import { formatTime, timeToMS } from '../../functions/time';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'seek',
  description: '🎶 › Go to a specific time of the music.',
  dmPermission: false,
  playerOnly: true,
  sameChannelOnly: true,
  prefixCompatible: true,
  options: [
    {
      name: 'time',
      description: 'The time for me to go',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  exec({ context }) {
    if (!context.args[0] || !timeToMS(context.args[0])) {
      return context.reply({
        content: '**☝️ Please provied a valid time like:** `5m`, `1h20m`, `60s`'
      });
    }

    const time = timeToMS(context.args[0]);
    const { position } = context.player;
    const { duration } = context.player.current;

    if (time <= duration) {
      if (time > position) {
        context.player.seek(time);
        return context.reply({
          content: `**🎤 ›** ***Going to ${formatTime(time)}...***`
        });
      }
      context.player.seek(time);
      return context.reply({
        content: `**🎤 ›** ***Backing to ${formatTime(time)}...***`
      });
    }
    return context.reply({
      content: '**☝️ › That time exceeds the track duration.**'
    });
  }
});
