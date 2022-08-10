import { TextChannel } from 'discord.js';
import { Node, NodeOptions, Vulkava } from 'vulkava';
import { IncomingDiscordPayload, OutgoingDiscordPayload } from 'vulkava/lib/@types';
import play from '../commands/music/play';
import type { Siesta } from './Client';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export class Manager extends Vulkava {
  client: Siesta;

  constructor(client: Siesta, nodes: NodeOptions[]) {
    super({
      nodes,
      sendWS: (guildId: string, payload: OutgoingDiscordPayload) => client.guilds.cache.get(guildId)?.shard.send(payload)
    });

    this.client = client;

    this.on('nodeConnect', (node: Node) => {
      this.client.logger.info(`Node ${node.options.id} Connected`, { tags: ['Vulkava'] });
      setInterval(() => {
        node.send({
          op: 'pong'
        });
      }, 45000);
    });
    this.on('nodeDisconnect', (node: Node) => this.client.logger.info(`Node ${node.options.id} Disconected`, { tags: ['Vulkava'] }));
    this.on('trackStart', (player, track) => {
      const channel = client.guilds.cache.get(player.guildId).channels.cache.get(player.textChannelId) as TextChannel;

      channel
        .send({
          content: `**🎤 Starting to play \`${track.title.replaceAll('`', "'")}\`**`
        })
        .then(msg => {
          const ONE_MINUTE = 60000;
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, ONE_MINUTE * 3);
        });
    });

    this.on('queueEnd', async player => {
      await sleep(3 * 60 * 1000);
      if (this.players.get(player.guildId) && this.players.get(player.guildId).queue.size === 0) {
        const channel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
        channel.send({
          content: "**🔇 I wasn't playing for 3 minutes so i left the channel.**"
        });
      }
    });

    this.on('error', (node, error) => {
      this.client.logger.warn(`Error in ${node.options.id} (${error.message})`, { tags: ['Vulkava'] });
    });
  }

  init() {
    super.start(this.client.user.id);
    this.client.on('raw', (packet: IncomingDiscordPayload) => this.handleVoiceUpdate(packet));
  }
}
