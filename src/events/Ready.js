import EventStructure from "../core/structures/EventStructure.js"
import { consoleTable } from "../core/utils/loggingUtils.js"
import { ActivityType, BaseInteraction } from "discord.js"

export default class extends EventStructure {
    constructor(client) {
        super(client, {
            name: "ready",
        })
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

        await consoleTable("Info", botInfo)

        await this.client.deployCommands()
    }
}
