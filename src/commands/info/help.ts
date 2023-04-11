import { EmbedBuilder } from 'discord.js';
import { readdirSync } from 'node:fs';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'help',
  description: '🛰️ › Sends some infos about me and my commands in case you need it.',
  dmPermission: true,
  prefixCompatible: true,
  aliases: ['commands', 'comandos', 'h', 'cmds', 'ajuda'],
  exec({ context, client }) {
    const musicCommands = readdirSync(`${process.cwd()}/src/commands/music`).map(file => {
      return `\`${file.replace('.ts', '').replace('js', '')}\``;
    });
    const informationCommands = readdirSync(`${process.cwd()}/src/commands/info`).map(file => {
      return `\`${file.replace('.ts', '').replace('js', '')}\``;
    });
    const configurationCommands = readdirSync(`${process.cwd()}/src/commands/configs`).map(file => {
      return `\`${file.replace('.ts', '').replace('js', '')}\``;
    });

    const embed = new EmbedBuilder()
      .setColor('#89b4fa')
      .setAuthor({ name: 'Help Menu', iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `> Currently i have **${
          client.commands.filter(cmd => !cmd.ownerOnly).size
        } commands!**\n> If you need **help with anything** you can **join my [support server](https://discord.gg/ZBtcHpEQEh)!**\n> **You Can invite me using \`/invite\`!**`
      )
      .addFields(
        {
          name: `🛰️ Information Commands [${informationCommands.length}]`,
          value: informationCommands.join(', '),
          inline: true
        },
        {
          name: `🎤 Music Commands [${musicCommands.length}]`,
          value: musicCommands.join(', '),
          inline: true
        },
        {
          name: `📝 Configuration Commands [${configurationCommands.length}]`,
          value: configurationCommands.join(', '),
          inline: true
        }
      );

    return context.reply({
      embeds: [embed]
    });
  }
});
