import EventStructure from "../core/structures/EventStructure.js"
import { log } from "../core/utils/loggingUtils.js"
import { BaseInteraction, CommandInteraction } from "discord.js"

export default class extends EventStructure {
    constructor(client) {
        super(client, {
            name: "interactionCreate",
        })
    }

    /**
     * @param {CommandInteraction | BaseInteraction} interaction
     */
    run = (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const command = this.client.slashCommands.get(interaction.commandName)

        if (!command) returnb

        try {
            command.run(interaction)
        } catch (err) {
            log({ title: `Events: interactionCreate: Command: '${command.name}'`, message: err }, "ERROR")
        }
    }
}
