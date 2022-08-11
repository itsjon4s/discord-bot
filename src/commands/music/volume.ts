import { ApplicationCommandOptionType } from 'discord.js';
import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'volume',
  description: 'Change the volume of the music.',
  playerOnly: true,
  sameChannelOnly: true,
  options: [
    {
      name: 'number',
      description: 'The volume that is going to be applied',
      type: ApplicationCommandOptionType.Number,
      required: true
    }
  ],
  dmPermission: false,
  exec({ context, client }) {
    const player = client.manager.players.get(context.guild.id) as Player;
    const volume = Number(context.args[0]);
    if (volume <= 0 || volume > 500)
      return context.reply({
        content: '**☝️ The volume must be bettewn `0` and `500`.**',
        ephemeral: true
      });

    player.filters.setVolume(volume);
    return context.reply({
      content: `🎤 The volume has been set to \`${volume}\``
    });
  }
});
