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
  exec({ interaction, client }) {
    const player = client.manager.players.get(interaction.guildId) as Player;
    const volume: number = interaction.options.getNumber('number');
    if (volume <= 0 || volume > 500)
      return interaction.reply({
        content: '**☝️ The volume must be bettewn `0` and `500`.**'
      });

    player.filters.setVolume(volume);
    return interaction.reply({
      content: `🎤 The volume has been set to \`${volume}\``
    });
  }
});
