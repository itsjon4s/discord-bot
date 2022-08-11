import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'disconnect',
  description: 'Disconnects the bot from the voice channel and destroy the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  aliases: ['dc', 'leave', 'stop'],
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;
    player.destroy();

    return context.reply({
      content: "**🐬 Disconnected from the voice channel sucessfully, hope you've enjoyed it!**"
    });
  }
});
