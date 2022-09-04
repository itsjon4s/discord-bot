// eslint-disable no-control-regex
import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'connections',
  ownerOnly: true,
  prefixCompatible: true,
  description: '☝️ › Developers Only',
  exec({ context }) {
    let players: Player[] = [];
    context.client.manager.players.forEach(player => players.push(player));
    const mappedPlayers = players.map(player => {
      return `**${context.client.guilds.cache.get(player.guildId)}** - Queue size: **${player.queue.size}**, Playing: **${player.playing}**, Loop: **${player.trackRepeat}/${player.queueRepeat}**`;
    });
    return context.reply({
      content: mappedPlayers.length > 0 ? mappedPlayers.join('\n') : '**😔 There\'s no players playing right now**'
    });
  }
});
