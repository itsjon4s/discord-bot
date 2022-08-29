/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { Colors, EmbedBuilder, User } from 'discord.js';
import { shorten } from '../../functions/text';
import { convertMs } from '../../functions/time';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'queue',
  description: '🎶 › See the list of songs that are going to play.',
  playerOnly: true,
  sameChannelOnly: false,
  aliases: ['q', 'fila', 'nowplaying', 'np'],
  dmPermission: false,
  exec({ context }) {
    const queue = context.player.queue as Queue;

    const multiple = 15;
    const page = 1;
    const end = page * multiple;
    const start = end - multiple;

    const { current } = context.player;
    const requester = current?.requester as User;

    if (queue.size === 0 && !current)
      return context.reply({
        content: '☝️ There is nothing playing and the queue is empty',
        ephemeral: true
      });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Queue - ${context.guild.name}`,
        iconURL: context.guild.iconURL()
      })
      .setDescription(queue.size > 0 ? queue.getTracksData(start, end) : '😔 The queue is empty')
      .setColor(Colors.DarkGrey)
      .addFields(
        {
          name: '🛰️ Currently Playing',
          value: `${shorten(current.title, 100)}, **Resquested by:** \`${requester.tag}\`\n[ ${
            current.isStream
              ? '**🔴 LIVE**'
              : `**${formatTime(convertMs(context.player.position))} \`${progressBar(context.player.position / 1000 / 50, current.duration / 1000 / 50, 20)}\` ${formatTime(
                  convertMs(current.duration)
                )}** ]`
          }`,
          inline: true
        },
        {
          name: '🕯️Queue size',
          value: `**${queue.size} songs**`,
          inline: true
        }
      );

    return context.reply({
      embeds: [embed]
    });
  }
});

function progressBar(current: number, total: number, barSize: number) {
  const progress = Math.round((barSize * current) / total);

  return `${'━'.repeat(progress > 0 ? progress - 1 : progress)}⚪${'─'.repeat(barSize - progress)}`;
}

function formatTime(time: object, format = 'dd:hh:mm:ss') {
  const formats = { dd: 'days', hh: 'hours', mm: 'minutes', ss: 'seconds' };

  const newFormat = format.replace(/dd|hh|mm|ss/g, match => time[formats[match]].toString().padStart(2, '0')).replace(/^(00:)+/g, '');

  return newFormat.length > 2 ? newFormat : `00:${newFormat}`;
}
