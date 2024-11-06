import EventBuilder from "../core/builders/EventBuilder.js"
import { consoleTable } from "../core/utils/loggingUtils.js"
import { ActivityType, BaseInteraction, Events } from "discord.js"
import DiscordClientHandler from "../core/handlers/DiscordClientHandler.js"

/**
 * Evento que indica que o cliente está pronto
 * 
 * @class 
 * @extends EventBuilder
 */
export default class extends EventBuilder {
    /**
     * Cria uma nova instância do evento "ready".
     * 
     * @param {DiscordClientHandler} client - A instância do DiscordClientHandler.
     */
    constructor(client) {
        super(client)
        this.setName(Events.ClientReady)
    }

    /**
     * @param {BaseInteraction} interaction
     */
    run = async (interaction) => {
        const botInfo = [
            ["Status:".cyan, "Online".green],
            ["Name:".cyan, `${this.client.user.tag}`.yellow],
            ["Guilds:".cyan, `${this.client.guilds.cache.size}`.yellow],
        ]

        this.client.user.setActivity({
            type: ActivityType.Custom,
            name: "Projeto Ygg",
            state: "Glory!",
        })

        consoleTable("Info", botInfo)

        await this.client.deployCommands()
    }
}
