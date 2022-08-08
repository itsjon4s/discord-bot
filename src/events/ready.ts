import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("ready", () => {
    client.logger.ready(`${client.user.tag} is online!`)
});
