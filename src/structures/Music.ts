import { TextChannel } from 'discord.js';
import { NodeOptions, Vulkava } from 'vulkava';
import { IncomingDiscordPayload, OutgoingDiscordPayload } from 'vulkava/lib/@types';
import type { Siesta } from './Client';

export class Manager extends Vulkava {
  client: Siesta;

  constructor(client: Siesta, nodes: NodeOptions[]) {
    super({
      nodes,
      sendWS: (guildId: string, payload: OutgoingDiscordPayload) => client.guilds.cache.get(guildId)?.shard.send(payload)
    });

    this.client = client;

    this.on('nodeConnect', node => this.client.logger.info(`Node ${node.options.id} Connected`, { tags: ['Vulkava'] }));
    this.on('nodeDisconnect', node => this.client.logger.info(`Node ${node.options.id} Disconected`, { tags: ['Vulkava'] }));
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
  }

  init() {
    super.start(this.client.user.id);
    this.client.on('raw', (packet: IncomingDiscordPayload) => this.handleVoiceUpdate(packet));
  }
}
