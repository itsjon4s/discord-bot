import { Player } from 'vulkava';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'skip',
  description: 'Skips the current track.',
  playerOnly: true,
  sameChannelOnly: true,
  exec({ interaction, client }) {
    const player = client.manager.players.get(interaction.guildId) as Player;

    if (player.queue.size === 0)
      return interaction.reply({
        content: "☝️ The queue is empty so there's no tracks to be skiped",
        ephemeral: true
      });

    player.skip();

    return interaction.reply({
      content: '🎤 Music skiped sucefully.'
    });
  }
});
