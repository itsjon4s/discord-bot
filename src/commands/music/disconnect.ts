import { Player } from "vulkava";
import { Command } from "../../structures/Command";

export default new Command({
  name: 'disconnect',
  description: 'Disconnects the bot from the voice channel and destroy the queue.',
  playerOnly: true,
  sameChannelOnly: true,
  exec({ interaction, client }) {
    const player = client.manager.players.get(interaction.guildId) as Player;
    player.destroy()

    return interaction.reply({
      content: '**🐬 Disconnected from the voice channel sucessfully, hope you\'ve enjoyed it!**'
    })
  }
})