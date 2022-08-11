import { formatTime } from '../../functions/time';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'ping',
  description: '🛰️ › Replies with the bot latency.',
  dmPermission: true,
  exec({ context, client }) {
    context.reply({
      content: `**🏓 Pong!\n🛰️ Api - __${client.ws.ping}__ms\n⏱️ Uptime - __${formatTime(client.uptime)}__**`
    });
  }
});
