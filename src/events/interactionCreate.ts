import { ChatInputCommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Siesta } from "../structures/Client";
import { Event } from "../structures/Event";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.exec({
            args: interaction.options as CommandInteractionOptionResolver,
            client: client as Siesta,
            interaction: interaction as ChatInputCommandInteraction
        }).catch((err) => {
            client.logger.warn(`Error in command ${command.name}`)
            client.logger.error(err)
        })
    }
});
