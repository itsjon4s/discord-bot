import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { SearchResult, ConnectionState } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'play',
  description: 'Add a song/playlist to the queue',
  playerOnly: false,
  sameChannelOnly: true,
  ownerOnly: false,
  options: [
    {
      name: 'song',
      description: 'The name/url',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
    }
  ],
  async exec({ interaction, client }) {
    let player = client.manager.players.get(interaction.guild.id);
    const song = interaction.options.getString('song');
    const member = interaction.member as GuildMember

    const res: SearchResult = await client.manager.search(song);

    if (res.loadType === 'NO_MATCHES') return interaction.reply({
      content: `**<:errado:977717009833934898> There was no matches for that.**`
    })

    if (res.loadType === 'LOAD_FAILED') return interaction.reply({
      content: `**<:errado:977717009833934898> There was an error playing this song.**\n \`\`\`${res.exception}\`\`\``
    })

    if (!player) {
      player = client.manager.createPlayer({
        guildId: interaction.guild.id,
        voiceChannelId: member.voice.channelId,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
        queue: new Queue()
      });
      player.filters.setVolume(30);
    }

    if (player.state === ConnectionState.DISCONNECTED) player.connect();

    if (res.loadType === 'PLAYLIST_LOADED') {

      for (const track of res.tracks) {
        track.setRequester(interaction.user);
        player.queue.add(track);
      }
      
      interaction.reply({
        content: `**🎤 Added the playlist \`${res.playlistInfo.name.replaceAll('`', '"')}\` with \`${res.tracks.length}\` tracks.**`
      })
      if (!player.playing) player.play();
    } else {

      const track = res.tracks[0];
      track.setRequester(interaction.user);
      player.queue.add(track);

      interaction.reply({
        content: `**🎤 Added to the queue the music \`${track.title.replaceAll('`', '"')}\`**`
      })
      if (!player.playing) player.play();
    }
  }
});