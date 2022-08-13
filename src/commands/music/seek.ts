import { ApplicationCommandOptionType } from 'discord.js';
import { Player } from 'vulkava';
import { formatTime, timeToMS } from '../../functions/time';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'seek',
  description: '🎶 › Go to a specific time of the music.',
  dmPermission: false,
  playerOnly: true,
  sameChannelOnly: true,
  options: [
    {
      name: 'time',
      description: 'The time for me to go',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;

    if (!context.args[0] || !timeToMS(context.args[0])) {
      return context.reply({
        content: `**☝️ Please provied a valid time like:** \`5m\`, \`1h20m\`, \`60s\``
      });
    }

    const time = timeToMS(context.args[0]);
    const position = player.position;
    const duration = player.current.duration;

    if (time <= duration) {
      if (time > position) {
        player.seek(time);
        return context.reply({
          content: `**🎤 ›** ***Going to ${formatTime(time)}...***`
        });
      } else {
        player.seek(time);
        return context.reply({
          content: `**🎤 ›** ***Backing to ${formatTime(time)}...***`
        });
      }
    } else {
      return context.reply({
        content: `**☝️ › That time exceeds the track duration.**`
      });
    }
  }
});
