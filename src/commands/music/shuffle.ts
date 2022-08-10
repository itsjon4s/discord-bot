import { Player } from "vulkava";
import { Command } from "../../structures/Command";
import { Queue } from "../../structures/Queue";

export default new Command({
  name: 'shuffle',
  description: 'Shuffles the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  exec({ interaction, client }) {
    
    const player = client.manager.players.get(interaction.guildId) as Player;

    (player.queue as Queue).shuffle();
    return interaction.reply({
      content: '🕯️ The queue was shuffled sucessfully'
    })
  }
})