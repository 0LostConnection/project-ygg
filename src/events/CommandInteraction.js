import EventBuilder from "../core/builders/EventBuilder.js"
import { log } from "../core/utils/loggingUtils.js"
import { BaseInteraction, CommandInteraction, Events } from "discord.js"

/**
 * Evento que manipula a interação do tipo "interactionCreate".
 * Trata especificamente de interações feitas por comando
 * 
 * @class
 * @extends EventStructure
 */
export default class extends EventBuilder {
    /**
     * Cria uma nova instância do evento "interactionCreate".
     * 
     * @param {DiscordClientHandler} client - A instância do CustomClient.
     */
    constructor(client) {
        super(client)
        this.setName(Events.InteractionCreate)
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
