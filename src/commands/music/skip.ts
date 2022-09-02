import { Command } from '../../structures/Command';

export default new Command({
  name: 'skip',
  description: '🎶 › Skips the current track.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  aliases: ['s', 'pular'],
  prefixCompatible: true,
  exec({ context }) {
    if (!context.player.current) {
      return context.reply({
        content: '**☝️ There is nothing playing.**',
        ephemeral: true
      });
    }

    context.player.skip();

    return context.reply({
      content: '**🎤 Music skiped sucefully.**'
    });
  }
});
