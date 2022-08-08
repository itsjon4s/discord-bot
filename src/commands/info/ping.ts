import { Command } from '../../structures/Command';

export default new Command({
  name: 'ping',
  description: 'replies with pong',
  exec: ({ interaction, client }) => {
    interaction.reply({
      content: `**🏓 Pong!\n🛰️ Api - __${client.ws.ping}__ms**`
    });
  }
});
