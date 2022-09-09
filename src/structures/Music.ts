/* eslint-disable no-promise-executor-return */
import type { TextChannel } from 'discord.js';
import { Node, NodeOptions, Track, Vulkava } from 'vulkava';
import type { Siesta } from './Client';

const sleep = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));

export class Manager extends Vulkava {
  client: Siesta;
  autoplay: Map<string, Track>;

  constructor(client: Siesta, nodes: NodeOptions[]) {
    super({
      nodes,
      sendWS: (guildId, payload) => client.guilds.cache.get(guildId)?.shard.send(payload)
    });

    this.client = client;
    this.autoplay = new Map();

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

      if (this.autoplay.get(player.guildId)) {
        this.autoplay.delete(player.guildId);
        this.autoplay.set(player.guildId, track);
      }

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
      if (this.autoplay.get(player.guildId)) {
        const track = this.autoplay.get(player.guildId);
        const results = await this.search(`https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`);
        if (!results.tracks.length) {
          return player.destroy();
        }
        const tracks = results.tracks.map(newTrack => (newTrack.title !== track.title ? newTrack : null)).filter(f => f);
        const newTrack = tracks[Math.floor(Math.random() * tracks.length)];
        newTrack.setRequester({
          tag: this.client.user.tag,
          id: this.client.user.id
        });
        player.queue.add(newTrack);
        player.play().catch(() => {});
      } else {
        await sleep(3 * 60 * 1000);
        if (this.players.get(player.guildId) && this.players.get(player.guildId).queue.size === 0 && !this.players.get(player.guildId).playing) {
          const channel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
          channel.send({
            content: "**🔇 I wasn't playing for 3 minutes so i left the channel.**"
          });
          player.destroy();
        }
      }
    });

    this.on('error', (node, error) => {
      this.client.logger.warn(`Error in ${node.options.id} (${error.message})`, { tags: ['Vulkava'] });
    });
  }

  init() {
    super.start(this.client.user.id);
    this.client.on('raw', packet => this.handleVoiceUpdate(packet));
  }
}
