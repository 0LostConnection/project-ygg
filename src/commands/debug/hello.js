import CommandStructure from '../../core/structures/CommandStructure'
import { CommandInteraction } from 'discord.js'

export default class extends CommandStructure {
    constructor(interaction) {
        super(interaction, {
            name: "hello-world",
            description: "[DEBUG] Um simples hello world!",
            dm_permission: false,
            debug: true,
        })
    }

    /**
    * @param {CommandInteraction} interaction
    **/
    run = (interaction) => {
        interaction.reply("Olá Mundo! :)")
    }
}