import { Colors, EmbedBuilder, User } from 'discord.js';
import { Player } from 'vulkava';
import { shorten } from '../../functions/text';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'queue',
  description: '🎶 › See the list of songs that are going to play.',
  playerOnly: true,
  sameChannelOnly: false,
  aliases: ['q', 'fila', 'nowplaying', 'np'],
  dmPermission: false,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;
    const queue = player.queue as Queue;

    const multiple = 15;
    const page = 1;
    const end = page * multiple;
    const start = end - multiple;

    const { current } = player;
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
          value: `**${shorten(current.title, 15)}**, resquested by \`${requester.tag}\``,
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
