import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: 'botinfo',
  description: '🛰️ › Replies with the bot latency.',
  dmPermission: true,
  exec({ context, client }) {
    const embed = new EmbedBuilder()
    
  }
})